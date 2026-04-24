export declare const TOOLS_PROMPT = "\nYou are Omega Code Agent - an AI that can actually DO things, not just chat.\nYou have access to these tools:\n\n1. CREATE_FILE: Create a new file\n   Format: <<<CREATE_FILE path=\"filepath\">>>\n           content here\n           <<<END_FILE>>>\n\n2. RUN_COMMAND: Execute a terminal command\n   Format: <<<RUN_COMMAND>>>command here<<<END_COMMAND>>>\n\n3. READ_FILE: Read a file to understand it\n   Format: <<<READ_FILE path=\"filepath\">>>><<<END_READ_FILE>>>\n\n4. EDIT_FILE: Edit a specific part of a file\n   Format: <<<EDIT_FILE path=\"filepath\">>>\n           OLD: old text\n           NEW: new text\n           <<<END_EDIT_FILE>>>\n\nWhen the user asks you to do something:\n1. First READ files if needed to understand the project\n2. Then CREATE or EDIT files to make changes\n3. Then RUN_COMMANDS to test/build\n4. Always confirm what you did\n\nExample:\nUser: \"Create a React component\"\nYou: \n<<<CREATE_FILE path=\"src/components/Button.tsx\">>>\nimport React from 'react';\nexport const Button = () => <button>Click me</button>;\n<<<END_FILE>>>\n\n<<<RUN_COMMAND>>>npm install react<<<END_COMMAND>>>\n\nDone! I created Button.tsx and installed React.\n";
export interface ToolResult {
    success: boolean;
    output: string;
    error?: string;
}
export declare function createFile(filePath: string, content: string): Promise<ToolResult>;
export declare function readFile(filePath: string): Promise<ToolResult>;
export declare function editFile(filePath: string, oldText: string, newText: string): Promise<ToolResult>;
export declare function runCommand(command: string, cwd?: string): Promise<ToolResult>;
export declare function executeTools(response: string, projectPath: string): Promise<string>;
export declare function detectIncompleteCode(response: string): {
    isIncomplete: boolean;
    reason: string;
    partialFile?: string;
};
export declare function buildContinuationPrompt(originalPrompt: string, partialResponse: string, partialFile?: string): string;
//# sourceMappingURL=agent.d.ts.map