export interface CliCommand {
  name: string;
  description: string;
  args?: Argument[];
  options?: Option[];
  action: (...args: any[]) => void | Promise<void>;
}

interface BaseOption {
  flag: string;
  description: string;
}

interface Option extends BaseOption {
  defaultValue?: string | boolean | string[] | undefined;
}

interface Argument extends BaseOption {
  defaultValue?: unknown;
}
