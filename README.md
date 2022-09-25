# Ayberk documentation

Ayberk is a client/server approach for storing and serving distributed configurations across multiple applications and environments in runtime. Also, it provides feature flag services.

# Concepts

### Environment

This concept is for dividing the environments. For example, a minimum setup should has 3 environments as development, staging and production.

### Project

An environment should include some projects.

### Variables

Any project has some variables. a variable consits of a key and a value. The key is a string and the value can be any type (e.g. string, number, object, etc)

A variable has an scope. The scope can be a project or global. If the variable is a project variable, only the services that are authenticated to the defined project can access it and if the variable is a global variable, all of the projects of the environment have the access to use that.

> Project level variables can override global variables (if the names are same)
> 
- Variables can be encrypted.

### Consumer

A consumer is a client that will be authenticated and use the variables.

Consumer can interact with Ayberk’s server through HTTP - RESTful API or using the SDK.

### Operator

Any user (best to call them operators) that can create/modify/view environments, projects and variables. An operator in the condition of having the privileges, can:

1. Register/delete/modify new operators and their privileges.
2. Create environments
3. Create projects
4. Create variables for projects or environments (known as global variables)

### Events (Future release)

The server can send an event to the consumer in the case of a variable’s value change. This is useful to avoid applications to be restarted to read the updated variables. For using this feature, it’s better to use the AyberkSDK. 

**Brain Storm:** Modules in the source code of a project, should be re-initialized after an event is sent. For instance database modules which is responsible to handle the connection to database, should run the `.connect()` method after the `Database.Reconnect` event is sent. In AyberkSDK we will have **EventListeners** that are responsible to trigger a functionality right after it receives a modification event. The event is an object including the event name and the variable. Like:

```json
{
	"event": {
		"eventName": "Database.Reconnect",
		"announcedAt": "DateTime" 
	},
	"data": {
		"variables": [
			{
				"key": "database-password",
				"value": "newP@ssword"
			}
		],
	}
}
```

### Scheduler

An operator can schedule  modification of a variable. For example the modification can be applied on a specific group of environments/projects and even consumers.

# FFs

1. Ayberk setup should be done using the front-end app and no `.yml` files should be used to setup the Ayberk.
2. Upload `.env` files to import the variables
3. Feature flags
4. Variable modification scheduler

## TODO
[ ] Import all config variables from `config.yml` to settings module and use them by importing settings module in other modules
[ ] Double check jwt signature