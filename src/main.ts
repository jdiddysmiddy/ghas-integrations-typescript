import * as core from '@actions/core';
import { Octokit } from "octokit";
import { getDependabotAlertsFromEnterprise } from './dependabot/enterprise';
import { getDependabotAlertsFromRepo } from './dependabot/repo';
import { getDependabotAlertsFromOrganization } from './dependabot/organization';
import { getDependabotAlertsFromAlertNumber } from './dependabot/alertnumber';

//import { wait } from './wait';

// Initialize github token
const githubToken: string = core.getInput('github-auth-token');

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit: Octokit = new Octokit({
  auth: githubToken
})

// Initialize the 
const alertScope: string = core.getInput('dependabot-alert-scope');

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  
  try {


    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    //core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    //core.setOutput('time', new Date().toTimeString())

    if (alertScope == 'enterprise') {
      getDependabotAlertsFromEnterprise(octokit);
    }

    if (alertScope == 'organization') {
      getDependabotAlertsFromOrganization(octokit);
    }

    if (alertScope == 'repo') {
      getDependabotAlertsFromRepo(octokit);
    }

    if (alertScope == 'alert') {
      getDependabotAlertsFromAlertNumber(octokit);
    }

  } catch (error) {
    
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  
  }
}
