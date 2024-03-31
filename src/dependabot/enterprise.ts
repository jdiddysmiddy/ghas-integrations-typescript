import * as core from '@actions/core';
import { Octokit } from "octokit"
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';


/**
 * 
 * The getDependabotAlerts function gets the alerts from GHAS enterprise repos
 * @returns {Promise<void>} Resolves when the DependABot alerts are fetched from GH Enterprise.
 */
export async function getDependabotAlertsFromEnterprise(octokit: Octokit): Promise<void> {

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