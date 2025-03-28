const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to find TypeScript files recursively
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main script
console.log('Scanning for TypeScript files...');
const tsFiles = findTsFiles('./src');
console.log(`Found ${tsFiles.length} TypeScript files.`);

// Process each file
tsFiles.forEach((filePath) => {
  console.log(`Processing: ${filePath}`);

  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');

    // Find import statements
    const importRegex = /import\s+{([^}]*)}\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    let modified = false;

    // Find all imports that might have unused imports
    const imports = [];
    while ((match = importRegex.exec(content)) !== null) {
      const importContent = match[1].trim();
      const importPath = match[2];
      const importStart = match.index;
      const importEnd = importStart + match[0].length;

      imports.push({
        content: importContent,
        path: importPath,
        start: importStart,
        end: importEnd,
        fullMatch: match[0],
      });
    }

    // Loop through imports in reverse order (to avoid changing indexes when modifying the content)
    for (let i = imports.length - 1; i >= 0; i--) {
      const imp = imports[i];

      // Split by comma and trim to get individual imports
      const importedItems = imp.content.split(',').map((item) => item.trim());

      // Check each imported item to see if it's used
      const unusedItems = [];
      importedItems.forEach((item) => {
        // Skip type imports (which may not be found in grep)
        if (item.startsWith('type ')) return;

        try {
          // Escape special characters for grep
          const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // Try to find the item in the file, excluding the import statement
          const grepCommand = `grep -o "${escapedItem}" ${filePath} | wc -l`;
          const count = parseInt(
            execSync(grepCommand, { encoding: 'utf8' }).trim(),
          );

          // If only found once (in the import statement itself) or not found, it's unused
          if (count <= 1) {
            unusedItems.push(item);
          }
        } catch (error) {
          console.error(
            `Error checking usage of ${item} in ${filePath}:`,
            error.message,
          );
        }
      });

      // If we found unused items, remove them from the import
      if (unusedItems.length > 0) {
        console.log(
          `Found unused imports in ${filePath}: ${unusedItems.join(', ')}`,
        );

        // Remove the unused items from the imported items list
        const updatedItems = importedItems.filter(
          (item) => !unusedItems.includes(item),
        );

        // If no items left, remove the entire import statement
        if (updatedItems.length === 0) {
          content =
            content.substring(0, imp.start) + content.substring(imp.end);
        } else {
          // Otherwise, update the import statement
          const updatedImport = `import { ${updatedItems.join(', ')} } from '${imp.path}'`;
          content =
            content.substring(0, imp.start) +
            updatedImport +
            content.substring(imp.end);
        }

        modified = true;
      }
    }

    // If changes were made, write the file back
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('Done!');
