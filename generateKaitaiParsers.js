import util from "node:util";
import { exec } from "child_process";
import directoryTree from "directory-tree";
import path from "node:path";

const promiseExec = util.promisify(exec);
const promises = [];
directoryTree('./kaitai/', { extensions: /\.ksy$/, }, (item, filepath) => {
    promises.push(promiseExec(`kaitai-struct-compiler --no-auto-read -t javascript -d ./src/kaitai/${path.parse(item.name).name}/ ./${filepath}`)
        .then((result) => {
            if (result.stdout){
                console.group('[WARNING]', item.name);
                console.log(result.stdout);
                console.groupEnd();
            }
            if (result.stderr){
                console.group('[ERROR]', item.name);
                console.error(result.stderr);
                console.groupEnd();
            }
            if (!result.stdout && !result.stderr){
                console.log('[SUCCESS] Kaitai parser:', item.name, 'converted successfully!');
            }
            
        })
        .catch((result) => {
            console.group('[ERROR]', item.name);
            console.error(result);
            console.groupEnd();
        })
    );
});

await Promise.allSettled(promises);