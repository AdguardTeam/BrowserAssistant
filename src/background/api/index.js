/**
 * To enable stub host api
 * 1. comment import from nativeHostApi and Api declaration
 * 2. uncomment import from stubHostApi and Api declaration
 */

// import { StubHostApi } from './stubHostApi';
// const Api = StubHostApi;

import { NativeHostApi } from './nativeHostApi';

const Api = NativeHostApi;

export { Api };
