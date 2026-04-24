"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLS_PROMPT = void 0;
exports.createFile = createFile;
exports.readFile = readFile;
exports.editFile = editFile;
exports.runCommand = runCommand;
exports.executeTools = executeTools;
exports.detectIncompleteCode = detectIncompleteCode;
exports.buildContinuationPrompt = buildContinuationPrompt;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Tool definitions for the AI
exports.TOOLS_PROMPT = `
You are Omega Code Agent - an AI that can actually DO things, not just chat.
You have access to these tools:

1. CREATE_FILE: Create a new file
   Format: <<<CREATE_FILE path="filepath">>>
           content here
           <<<END_FILE>>>

2. RUN_COMMAND: Execute a terminal command
   Format: <<<RUN_COMMAND>>>command here<<<END_COMMAND>>>

3. READ_FILE: Read a file to understand it
   Format: <<<READ_FILE path="filepath">>>><<<END_READ_FILE>>>

4. EDIT_FILE: Edit a specific part of a file
   Format: <<<EDIT_FILE path="filepath">>>
           OLD: old text
           NEW: new text
           <<<END_EDIT_FILE>>>

When the user asks you to do something:
1. First READ files if needed to understand the project
2. Then CREATE or EDIT files to make changes
3. Then RUN_COMMANDS to test/build
4. Always confirm what you did

Example:
User: "Create a React component"
You: 
<<<CREATE_FILE path="src/components/Button.tsx">>>
import React from 'react';
export const Button = () => <button>Click me</button>;
<<<END_FILE>>>

<<<RUN_COMMAND>>>npm install react<<<END_COMMAND>>>

Done! I created Button.tsx and installed React.
`;
async function createFile(filePath, content) {
    try {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf-8');
        return { success: true, output: chalk_1.default.green(`✓ Created: ${filePath}`) };
    }
    catch (error) {
        return { success: false, output: '', error: error.message };
    }
}
async function readFile(filePath) {
    try {
        if (!await fs.pathExists(filePath)) {
            return { success: false, output: '', error: `File not found: ${filePath}` };
        }
        const content = await fs.readFile(filePath, 'utf-8');
        return { success: true, output: content };
    }
    catch (error) {
        return { success: false, output: '', error: error.message };
    }
}
async function editFile(filePath, oldText, newText) {
    try {
        if (!await fs.pathExists(filePath)) {
            return { success: false, output: '', error: `File not found: ${filePath}` };
        }
        const content = await fs.readFile(filePath, 'utf-8');
        if (!content.includes(oldText)) {
            return { success: false, output: '', error: `Could not find text to replace in ${filePath}` };
        }
        const newContent = content.replace(oldText, newText);
        await fs.writeFile(filePath, newContent, 'utf-8');
        return { success: true, output: chalk_1.default.green(`✓ Edited: ${filePath}`) };
    }
    catch (error) {
        return { success: false, output: '', error: error.message };
    }
}
async function runCommand(command, cwd = '.') {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd, timeout: 60000 });
        return {
            success: true,
            output: stdout || stderr || 'Command completed successfully'
        };
    }
    catch (error) {
        return {
            success: false,
            output: error.stdout || '',
            error: error.stderr || error.message
        };
    }
}
async function executeTools(response, projectPath) {
    let executedResponse = response;
    let toolResults = [];
    // Parse CREATE_FILE
    const createFileRegex = /<<<CREATE_FILE path="([^"]+)">>>([\s\S]*?)<<<END_FILE>>>/g;
    let match;
    while ((match = createFileRegex.exec(response)) !== null) {
        const filePath = path.join(projectPath, match[1]);
        const content = match[2].trim();
        const result = await createFile(filePath, content);
        toolResults.push(result.success ? result.output : chalk_1.default.red(`✗ Failed: ${result.error}`));
    }
    // Parse READ_FILE
    const readFileRegex = /<<<READ_FILE path="([^"]+)">>>(?:[\s\S]*?)<<<END_READ_FILE>>>/g;
    while ((match = readFileRegex.exec(response)) !== null) {
        const filePath = path.join(projectPath, match[1]);
        const result = await readFile(filePath);
        if (result.success) {
            // Replace the READ_FILE marker with actual content for AI context
            executedResponse = executedResponse.replace(match[0], `\n[File: ${match[1]}]\n\`\`\`\n${result.output}\n\`\`\`\n`);
        }
        else {
            toolResults.push(chalk_1.default.red(`✗ Failed to read ${match[1]}: ${result.error}`));
        }
    }
    // Parse EDIT_FILE
    const editFileRegex = /<<<EDIT_FILE path="([^"]+)">>>(?:[\s\S]*?)OLD:([\s\S]*?)NEW:([\s\S]*?)<<<END_EDIT_FILE>>>/g;
    while ((match = editFileRegex.exec(response)) !== null) {
        const filePath = path.join(projectPath, match[1]);
        const oldText = match[2].trim();
        const newText = match[3].trim();
        const result = await editFile(filePath, oldText, newText);
        toolResults.push(result.success ? result.output : chalk_1.default.red(`✗ Failed: ${result.error}`));
    }
    // Parse RUN_COMMAND
    const runCommandRegex = /<<<RUN_COMMAND>>>([\s\S]*?)<<<END_COMMAND>>>/g;
    while ((match = runCommandRegex.exec(response)) !== null) {
        const command = match[1].trim();
        console.log(chalk_1.default.yellow(`$ ${command}`));
        const result = await runCommand(command, projectPath);
        if (result.success) {
            console.log(chalk_1.default.gray(result.output));
            toolResults.push(chalk_1.default.green(`✓ Command executed: ${command}`));
        }
        else {
            console.log(chalk_1.default.red(result.error));
            toolResults.push(chalk_1.default.red(`✗ Command failed: ${command}`));
        }
    }
    // Remove tool markers from final output shown to user
    executedResponse = executedResponse
        .replace(/<<<CREATE_FILE path="[^"]+">>>[\s\S]*?<<<END_FILE>>>/g, '')
        .replace(/<<<READ_FILE path="[^"]+">>>(?:[\s\S]*?)<<<END_READ_FILE>>>/g, '')
        .replace(/<<<EDIT_FILE path="[^"]+">>>[\s\S]*?<<<END_EDIT_FILE>>>/g, '')
        .replace(/<<<RUN_COMMAND>>>[\s\S]*?<<<END_COMMAND>>>/g, '');
    // Add tool results at the end
    if (toolResults.length > 0) {
        executedResponse += '\n\n' + chalk_1.default.cyan('Actions performed:') + '\n' + toolResults.join('\n');
    }
    return executedResponse;
}
// Detect if AI response has incomplete/truncated code
function detectIncompleteCode(response) {
    // Check for unclosed CREATE_FILE blocks
    const openCreateFile = response.match(/<<<CREATE_FILE path="([^"]+)">>>(?!.*?<<<END_FILE>>>)/s);
    if (openCreateFile) {
        return {
            isIncomplete: true,
            reason: 'Unclosed CREATE_FILE block detected',
            partialFile: openCreateFile[1]
        };
    }
    // Check for incomplete code blocks (common truncation patterns)
    const incompletePatterns = [
        /def \w+\([^)]*\):\s*\n[^\n]*$/,
        /class \w+[^:]*:\s*\n[^\n]*$/,
        /if [^:]*:\s*\n[^\n]*$/,
        /for [^:]*:\s*\n[^\n]*$/,
        /while [^:]*:\s*\n[^\n]*$/,
        /try:\s*\n[^\n]*$/,
        /"""[^"]*$/,
        /'''[^']*$/,
        /\{[^}]*$/,
        /\([^)]*$/,
        /\[[^\]]*$/
    ];
    for (const pattern of incompletePatterns) {
        if (pattern.test(response)) {
            return { isIncomplete: true, reason: 'Code appears to be truncated mid-definition' };
        }
    }
    // Check if last non-empty line ends with continuation indicators
    const lines = response.split('\n').filter(l => l.trim());
    const lastLine = lines[lines.length - 1] || '';
    if (lastLine.match(/[,+\\\-]$/) || // Ends with operator or continuation
        lastLine.match(/:\s*$/) || // Ends with colon (incomplete block)
        lastLine.match(/\b(def|class|if|for|while|try|with|async|import|from)\s+\w+$/) || // Incomplete statement
        response.trim().endsWith('...')) {
        return { isIncomplete: true, reason: 'Response ends mid-statement' };
    }
    return { isIncomplete: false, reason: '' };
}
// Build continuation prompt for incomplete code
function buildContinuationPrompt(originalPrompt, partialResponse, partialFile) {
    return `
The previous response was truncated/incomplete. Please continue from where you left off.

ORIGINAL REQUEST:
${originalPrompt}

PREVIOUS (INCOMPLETE) RESPONSE:
${partialResponse}

INSTRUCTIONS:
1. Continue EXACTLY where the previous response ended
2. Complete any unfinished functions, classes, or statements
3. Close any unclosed blocks (functions, classes, if/else, try/except, etc.)
4. Add the missing <<<END_FILE>>> markers for any incomplete files
5. If file "${partialFile || 'unknown'}" was being written, complete it first
6. Do NOT repeat code that was already generated - only add the missing parts

Continue now:
`;
}
//# sourceMappingURL=agent.js.map