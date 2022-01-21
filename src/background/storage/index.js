import browser from 'webextension-polyfill';
import { Storage } from './storage';

export const storage = new Storage(browser.storage.local);
