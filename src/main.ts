import * as core from '@actions/core';
import { Octokit } from "octokit";
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
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
 * 
 * The getDependabotAlerts function gets the alerts from GHAS enterprise repos
 * @returns {Promise<void>} Resolves when the DependABot alerts are fetched from GH Enterprise.
 */
async function getDependaboutAlertsFromEnterprise(): Promise<void> {

  // Initialize the github context.
  const context: Context = github.context;

  const enterprise: string = context.payload.enterprise ;

  // Set base url
  let baseUrl: string = `/enterprises/${enterprise}/dependabot/alerts`;
      

  // Check for empty state and severity filter
  if (core.getInput('state') == '' && core.getInput('severity') == '') {

    // Alert user of status
    core.debug('Fetching all DependABot alerts');

      try {
          
        // Send request with base url 
        await octokit.request(`GET ${baseUrl}`, {
          enterprise: enterprise,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28', 
            'accept': 'application/vnd.github+json'
          }
        });

      } catch (error: any) {

        // Set workflow failure error 
        core.setFailed(error.message);

      }

    }
    

    // Check for both state and severity filters
    if (core.getInput('state') && core.getInput('severity')) {

      core.debug(`Getting alerts with a state of ${core.getInput('state')} and a severity of ${core.getInput('severity')}.`);

      try {

        // Update base url with state & severity query parameters 
        baseUrl += `?state=${core.getInput('state')}?severity=${core.getInput('severity')}`;

          // Send request with state and severity parameters 
          await octokit.request(`GET ${baseUrl}`, {
            enterprise: enterprise,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28', 
              'accept': 'application/vnd.github+json'
            }
          });
        
        } catch (error: any) {

          // Set workflow failure error 
          core.setFailed(error.message);
        }

      }


      // Check only for state filter
      if (core.getInput('state')) {

        core.debug(`Getting alerts with a state of ${core.getInput('state')}.`);

        try {
        
          // Update base url with only state filter
          baseUrl += `?state=${core.getInput('state')}`;

          // Send request with no parameters 
          await octokit.request(`GET ${baseUrl}`, {
            enterprise: enterprise,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28', 
              'accept': 'application/vnd.github+json'
            }
          });
        
        } catch (error: any) {

          // Set workflow failure
          core.setFailed(error.message)
        }

      }


      // Check only for severity filter
      if (core.getInput('severity')) {

        core.debug(`Getting alerts with a severity of ${core.getInput('severity')}.`);

        try {

          // Update base url with only the severity filter
          baseUrl += `?severity=${core.getInput('severity')}`;

          // Send request with severity parameter
          await octokit.request(`GET ${baseUrl}`, {
            enterprise: enterprise,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28', 
              'accept': 'application/vnd.github+json'
            }
          });

        } catch (error: any) {

          // Set workflow failure
          core.setFailed(error.message)
        }
      }

    } // End fetching DependABot alerts from an enterprise


    
  


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

    if(alertScope == 'enterprise') {
      getDependaboutAlertsFromEnterprise();
    }
  
  } catch (error) {
    
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  
  }
}
