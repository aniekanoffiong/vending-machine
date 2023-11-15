import * as express from 'express';
import App from '../../src/app';

export default class IntegrationHelpers {

    public static appInstance: express.Application;

    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }

        this.appInstance = App;

        return this.appInstance;
    }

}