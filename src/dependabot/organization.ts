import * as core from '@actions/core';
import { Octokit } from "octokit"
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';


/**
 * 
 * The getDependabotAlerts function gets the alerts from Org.
 * @returns {Promise<void>} Resolves when the DependABot alerts are fetched from GH Organization.
 */
export async function getDependabotAlertsFromOrganization(octokit: Octokit): Promise<void> {

    const context: Context = github.context;

    const org: string = context.payload.organization;

    let baseUrl: string = `/orgs/${org}/dependabot/alerts`


    // Check for blank filters
    if (core.getInput('state') == '' && core.getInput('severity') == '') {

        core.debug(`Fecthing all DependABot Alerts from organization: ${org}`);

        try {

            const response = await octokit.request(`GET ${baseUrl}`, {
                org: org,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (response.status == 200) {
                
            }
        } catch (error: any) {
            core.debug(error.message)
        }
    }


    // Check for both filters
    if (core.getInput('state') && core.getInput('severity')) {

        core.debug(`Fecthing DependABot Alerts from the ${org} organization, with a state of ${core.getInput('state')} and a severity of ${core.getInput('severity')}`);

        baseUrl += `?state=${core.getInput('state')}?severity=${core.getInput('severity')}`

        try {

            await octokit.request(`GET ${baseUrl}`, {
                org: org,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        } catch (error: any) {
            core.debug(error.message)
        }
    }


    // Check for the state filter only.
    if (core.getInput('state')) {

        core.debug(`Fecthing DependABot Alerts from the ${org} organization, with a state of ${core.getInput('state')}`);

        baseUrl += `?state=${core.getInput('state')}`;

        try {

            await octokit.request(`GET ${baseUrl}`, {
                org: org,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        } catch (error: any) {
            core.debug(error.message)
        }
    }

    // Check for the state filter only.
    if (core.getInput('severity')) {

        core.debug(`Fecthing DependABot Alerts from the ${org} organization, with a severity of ${core.getInput('severity')}`);

        baseUrl += `?severity=${core.getInput('severity')}`;

        try {

            await octokit.request(`GET ${baseUrl}`, {
                org: org,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        } catch (error: any) {
            core.debug(error.message)
        }
    } // End single repo alert fetching

}