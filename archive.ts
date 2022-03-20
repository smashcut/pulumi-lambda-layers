/**
 * This file is merely a script for the preparation stage before Pulumi IaC is run.
 * The lambda implementation in Pulumi requires an archive, this creates a zip file
 * out of any .lamda.js file created by tsc in the output directory. 
 */

import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';

// the name of directory the zip archive will be published to
const outputDir: string = process.env.OUTPUT_DIR || "dist";
// the fully qualified output path using this outputDir
const fullPathOutputDir: string = path.join(__dirname, outputDir);
// the file match pattern to ensure that the zip archive only pushes transpiled lambdas
const lambdaRegexp: RegExp = /\.lambda\.js$/i;

fs.readdir(
  fullPathOutputDir,
  async function (error: NodeJS.ErrnoException | null, files: string[]) {      
      for (let file of files) {
        // match the test pattern specified in lambdaRegexp
        if (lambdaRegexp.test(file)) {
					// get the file name w/o js extension
          const basename: string = path.basename(file, '.js');
          // create the archive
					const zip: AdmZip = new AdmZip();
          const outputFile = path.join(fullPathOutputDir, `${basename}.zip`);
          /** 
           * we add the file to the archive as index.js for standardization and ease 
           * it is common to see examples with index.ts files with a handler function inside.
           * However, to keep multiple lambdas organized it makes sense to use unique file
           * names or directory names (with an index.ts within)
           */
					zip.addLocalFile(path.join(fullPathOutputDir,file),'/','index.js');
					zip.writeZip(outputFile);
					console.log(`Created ${outputFile} successfully`);
				}
      }
  }
);