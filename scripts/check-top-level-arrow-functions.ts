import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
let hasError = false;

for (const file of project.getSourceFiles('src/**/*.{ts,tsx}')) {
  // トップレベルの変数宣言のみ取得
  for (const stmt of file.getVariableStatements()) {
    // export された宣言も含む
    for (const decl of stmt.getDeclarations()) {
      const init = decl.getInitializer();
      if (init?.getKind() === SyntaxKind.ArrowFunction) {
        const line = decl.getStartLineNumber();
        console.error(
          `${file.getFilePath()}:${line} - Use function declaration instead of top-level arrow function: ${decl.getName()}`,
        );
        hasError = true;
      }
    }
  }
}

process.exit(hasError ? 1 : 0);
