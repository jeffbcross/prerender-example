require('reflect-metadata');
require('zone.js');
import { readFileSync } from 'fs';
import * as path from 'path';
import { ReflectiveInjector, Type, NgModuleFactory } from '@angular/core';
import { COMPILER_PROVIDERS, JitCompiler, ResourceLoader } from '@angular/compiler';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';

import { AppServerModule } from './app/app.server.module';

const app = express();
const document = readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');


/** JIT COMPILATION */
/** Props to @alxhub for the trick! */
class FileLoader implements ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(readFileSync(path.resolve(__dirname, 'app', url)).toString());
    });
  }
}


// This is usually run in-place using ts-node, path is relative to src/
app.use(express.static(path.resolve(__dirname, '../dist'), {
	index: false
}));

const AppServerModuleNgFactoryPromise = compileModule(AppServerModule);

app.use((req, res, next) => {
  AppServerModuleNgFactoryPromise
		.then(factory => renderModuleFactory(factory, {
				document,
				url: req.url
			}))
		.then(body => res.send(body));
});

app.listen(6795);

/** JIT COMPILATION */
/** Props to @alxhub for the trick! */
export function compileModule<T>(module: Type<T>): Promise<NgModuleFactory<T>> {
  let injector = ReflectiveInjector.resolveAndCreate([
    COMPILER_PROVIDERS,
    {provide: ResourceLoader, useValue: new FileLoader()}
  ]);
  const compiler = injector.get(JitCompiler) as JitCompiler;
  return compiler.compileModuleAsync(module);
}