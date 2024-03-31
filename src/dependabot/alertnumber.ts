import * as core from '@actions/core';
import { Octokit } from "octokit"
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';


/**
 * 
 * The getDependabotAlertNumber function gets the alerts from GHAS alert number
 * @returns {Promise<void>} Resolves when the DependABot alerts are fetched from GH.
 */
export async function getDependabotAlertsFromAlertNumber(octokit: Octokit): Promise<void> {

    const context: Context = github.context;

    // const repoName: string = context.repo.repo;

    // const repoOwner: string = context.repo.owner;

    const alertNumber: string = core.getInput('dependabot-alert-number');

    if (core.getInput('dependabot-alert-number-repo') != '' && core.getInput('dependabot-alert-number-owner')) {
        
        try {

            const repoName: string = core.getInput('dependabot-alert-number-repo');

            const repoOwner: string = core.getInput('dependabot-alert-number-owner');

            let baseUrl: string = `/repos/${repoOwner}/${repoName}/dependabot/alerts/${alertNumber}`

            await octokit.request(`${baseUrl}`, {
                owner: repoOwner,
                repo: repoName,
                alert_number: alertNumber,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });


        } catch (error: any) {

        }

    }

}
