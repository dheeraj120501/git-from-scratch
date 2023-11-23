import { repoCreate } from "../objects/repository";

export default function cmd_init(path: string): void | Promise<void> {
  repoCreate(path);
}
