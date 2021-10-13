import { promises as fs} from "fs-extra";
import { refreshCommands } from "..";
import { getCommands } from "../commands/class";
import { build } from "tsc-prog";

export async function createCommand(folder: string) {
    build({
        basePath: __dirname,
        compilerOptions: {
            lib: ["es2020"],
            module: "commonjs",
            target: "es2020",

            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            noImplicitAny: true,
            removeComments: true
        },
        include: [folder]
    })
    await refreshCommands();
}
export async function deleteCommand(folder: string, command: string) {
    if (!(await getCommands()).has(command)) { new ReferenceError(`Command ${command} does not exist`) }
    await fs.rm(`${folder}/${command}.js`);
    await fs.rm(`${folder}/${command}.ts`);
    await refreshCommands()
}

class API {
    getCommands = getCommands;
    refreshCommands = refreshCommands;
    createCommands = createCommand;
    deleteCommand = deleteCommand;
}

export const api = new API()