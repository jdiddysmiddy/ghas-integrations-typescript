import * as core from '@actions/core';
import { Octokit } from "octokit"
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';


/**
 * 
 * The getDependabotAlerts function gets the alerts from GHAS enterprise repos
 * @returns {Promise<void>} Resolves when the DependABot alerts are fetched from GH Enterprise.
 */
export async function getDependabotAlertsFromRepo(octokit: Octokit): Promise<void> {

    const context: Context = github.context;

    const repoName: string = context.repo.repo;

    const repoOwner: string = context.repo.owner;
    
    let baseUrl: string = `/repos/${repoName}/${repoOwner}/dependabot/alerts`;

    // Check for blank filters
    if (core.getInput('state') == '' && core.getInput('severity') == '') {
        try {

            await octokit.request(`GET ${baseUrl}`, {
                owner: repoOwner,
                repo: repoName,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });

        } catch (error: any) {
            core.setFailed(error.message);
        }
    }

    // Check for state and severity filters.
    if (core.getInput('state') && core.getInput('severity')) {
        
        baseUrl += `?state=${core.getInput('state')}?severity=${core.getInput('severity')}`;
        
        try {

            // Send 
            await octokit.request(`GET ${baseUrl}`, {
                owner: repoOwner,
                repo: repoName,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        } catch (error: any) {
            core.debug(error.message)
        }

    }

    
    // Check for state filter only.
    if (core.getInput('state')) {

        baseUrl += `?state=${core.getInput('state')}`;

        try {

            // Send state filtered request
            await octokit.request(`GET ${baseUrl}`, {
                owner: repoOwner,
                repo: repoName,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        } catch (error: any) {
            core.debug(error.message);
        }
    }


    // Check for severity filter only.
    if (core.getInput('severity')) {
        baseUrl += `?severity=${core.getInput('severity')}`;
        try {  

            await octokit.request(`GET ${baseUrl}`, {
                owner: repoOwner,
                repo: repoName,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            
      } catch (error:any) {
            core.debug(error.message);
      } 
    } // End single repo alert fetching

}

