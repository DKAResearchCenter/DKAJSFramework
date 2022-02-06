<!--- sudo udevadm control --reload-rules && sudo udevadm trigger -->

## Setting your package.json
after install ``dkaframework`` you can setting file ``package.json`` in root project. like this :
```text
    "scripts": {
        "dev": "dka -b src/index.js",
        "dev-watch": "dka -n -w src -b src/index.js"
    }
```

## Command Description

**dka** is a cli interpreter dka framework <br/>
```text
dka [options,..] <file>
```
- option <br/>
  **-v, --version** show version framework <br/>
  **-h, --help** show help banner <br/>
  **-n, --nodemon** use nodemon interpreter <br/>
  **-b, --babel** use babel compiler for ESMA Script babel.<br/>
  **-w, --watch** use watch babel for automatically code change <br/>
  **-bc, --babelconfig "babel.config.js"** use costum babel config for your compile<br/>
  **-d, --debug** show debug process on console

### import/require module in your js program
```
import { Server, Database } from "dkaframework";
```
or
```
const { Server, Database } = require("dkaframework");
```
