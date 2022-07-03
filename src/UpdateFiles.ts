import {
    PWSH_PROFILE_PATH_LOCAL,
    PWSH_PROFILE_PATH_PROJECT,
    VERSION,
} from './constants';
import { isUpdated, pull } from './service/CheckLastCommit';
import { prompt } from 'inquirer';
import { CopyConfigFile } from './Config/CopyConfigFile';

const UPDATE_QUESTION =
    'There is an Update in your Repository! Do you want to update your configuration?';

async function main() {
    const updated = await isUpdated();

    console.log(`[Windows-Powershell-Autoconfig V${VERSION}]`);
    console.log('\n');
    console.log(' Checking for Updates...');
    console.log('\n');

    if (updated) {
        console.log('Everything up-to-date!');
        console.log('PROCEEDING WITH THE SHELL' + '\n');
        return;
    }

    // opens the prompt with the choices
    const answers = await prompt([
        {
            type: 'list',
            name: UPDATE_QUESTION,
            choices: ['yes', 'no'],
        },
    ]);
    const answer = answers[UPDATE_QUESTION];
    if (answer !== 'yes') return;

    // the code which gets executed if there is
    // an update and the user wished to proceed
    await pull();
    await CopyConfigFile(PWSH_PROFILE_PATH_PROJECT, PWSH_PROFILE_PATH_LOCAL);
    console.log('Your files have been updated!');
}

main();
