import { workspace } from 'coc.nvim';

// Cache of type: []string
let ENABLED_AND_SUPPORTED: string[] | null = null;
// Cache of type: bool
// let PYTHON_ENABLED: boolean | null = null;

function EnabledAndSupported() {
  if (ENABLED_AND_SUPPORTED === null) {
    const disabled = workspace.getConfiguration('kite').completions.disabledFileExtensions;
    const enabled = SupportedExtensions().filter((ext) => !disabled.includes(ext));
    ENABLED_AND_SUPPORTED = enabled;
  }
  return ENABLED_AND_SUPPORTED;
}

export function CompletionsSupport() {
  // Python has "FullCompletionsSupport" so filter from regular.
  const enabled = EnabledAndSupported()
    .filter((ext) => ext !== '.py' && ext !== '.pyw')
    .join(',');
  if (enabled === '') {
    return [];
  }
  return [
    { pattern: `**/*{${enabled}}`, scheme: 'file' },
    { pattern: `**/*{${enabled}}`, scheme: 'untitled' },
  ];
}

function SupportedExtensions() {
  return [
    '.c',
    '.cc',
    '.cpp',
    '.cs',
    '.css',
    '.go',
    '.h',
    '.hpp',
    '.html',
    '.java',
    '.js',
    '.jsx',
    '.kt',
    '.less',
    '.m',
    '.php',
    '.py',
    '.pyw',
    '.rb',
    '.scala',
    '.sh',
    '.ts',
    '.tsx',
    '.vue',
  ];
}

const lower = 'abcdefghijklmnopqrstuvwxyz';
const special = ',.\'"` ';

export const COMPILED_EXTENSIONS = (lower + lower.toUpperCase() + special).split('');
export const KITE_BRANDING = '𝕜𝕚𝕥𝕖';
export const OFFSET_ENCODING = 'utf-16';
export const MAX_FILE_SIZE = 1024 * Math.pow(2, 10); // 1024 KB
export const PYTHON_SUPPORTED = ['python'];
export const SUPPORTED_LANGUAGE = [
  ['c', 'c'],
  ['cc', 'cpp'],
  ['cpp', 'cpp'],
  ['cs', 'csharp'],
  ['css', 'css'],
  ['go', 'go'],
  ['h', 'c'],
  ['hpp', 'cpp'],
  ['html', 'html'],
  ['java', 'java'],
  ['js', 'javascript'],
  ['jsx', 'jsx'],
  ['kt', 'kotlin'],
  ['less', 'less'],
  ['m', 'objectivec'],
  ['php', 'php'],
  ['py', 'python'],
  ['pyw', 'python'],
  ['rb', 'ruby'],
  ['scala', 'scala'],
  ['sh', 'bash'],
  ['ts', 'typescript'],
  ['tsx', 'tsx'],
  ['vue', 'vue'],
].map((e) => e[1]);
