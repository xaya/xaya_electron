import * as webpack from 'webpack';
import { WebpackConfigOptions as ConfigOptions } from '@angular/cli/models/webpack-config';
import { BuildOptions } from '@angular/cli/models/build-options';
import node from 'file.node';
import * as path from 'path';
import * as resolve from 'resolve';
import * as WatchIgnorePlugin from 'watch-ignore-webpack-plugin';

export type Configuration = webpack.Configuration;
const DEFAULT_COMMAND = process.argv[2];

export default function (config: Configuration, options: ConfigOptions<BuildOptions>, argv) {
    console.log('For modify webpack build, you can usage ngw.config.ts');
    const command = argv || DEFAULT_COMMAND;
	
	
	
	let rule = {};
	

  switch(options.buildOptions.environment) 
  {
    case 'prod':

      rule = {
		
		 test: /\.node?$/,
				use: [
				{
				  loader: 'electron-node-loader',
					options: {
					  folder: './node_modules/zeromq/build/Release',
					  prod: true
				      }
			    }
				]		
	   };			  
	  
      break
    case 'dev':
	
    rule = {
		
		 test: /\.node?$/,
				use: [
				{
				  loader: 'electron-node-loader',
					options: {
					  folder: path.resolve(__dirname, './node_modules/zeromq/build/Release')
				      }
			    }
				]		
	};			
	
       break
  }	
	


	config.module.rules.push(rule);	
    config.plugins.push(new WatchIgnorePlugin([path.resolve(__dirname, './daemon/datadir')]));

    return config;
}
