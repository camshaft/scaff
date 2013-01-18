scaff(1)
========

Language-agnostic scaffolding engine

What?
-----

I wanted a tool I could use with any project, in any language, to generate code that I copied with every new project. Each language has their own tools ([rails](http://guides.rubyonrails.org/command_line.html#rails-generate), [rebar](https://github.com/basho/rebar/tree/master/priv/templates), [ngen](https://github.com/visionmedia/ngen), etc).

I wanted a common cli that was agnostic to the structure of an app and let it be extended by templates pulled down from github. This is `scaff`.


Getting Started
---------------

Install the scripts with npm
```sh
npm install -g scaff
```

Create an Application
---------------------

To get started use the `scaff new <name> -t, --template <template>` command and specify a directory and template to use

```sh
scaff new my-cool-app --template git://github.com/CamShaft/scaff-express.git
```

This will clone down the template and setup the inital project structure:

```sh
Cloning into '/Users/cameron/Projects/my-cool-app/.scaff/template'...
remote: Counting objects: 39, done.
remote: Compressing objects: 100% (24/24), done.
remote: Total 39 (delta 1), reused 38 (delta 0)
Receiving objects: 100% (39/39), 4.41 KiB, done.
Resolving deltas: 100% (1/1), done.

Express 3 Template:
  Project description: This is a really cool project!
  Enter your name: Cameron Bytheway
  Enter your email: cameron@nujii.com

  create : /Users/cameron/Projects/my-cool-app/.gitignore
  create : /Users/cameron/Projects/my-cool-app/app
  create : /Users/cameron/Projects/my-cool-app/app/css
...
  create : /Users/cameron/Projects/my-cool-app/test/server
  create : /Users/cameron/Projects/my-cool-app/server/app.test.js
```

Listing the Generators
-----------------

You can print out a list of available generators using `scaff generate`

```sh
cd my-cool-app
scaff generate
```

Using a Generator
-----------------

```sh
scaff generate <generator>
```

The generator will walk you through a series of questions and generate the new files:

```
scaff generate route

Express 3 Route:
  Route name: project
  Route: /projects/:id

  create : /Users/cameron/Projects/my-cool-app/routes/project.js
  create : /Users/cameron/Projects/my-cool-app/test/server/routes/project.test.js
  modify : /Users/cameron/Projects/my-cool-app/app.js

```

Making a Template
-----------------

More to come... For now check out the [examples](https://github.com/CamShaft/scaff/tree/master/examples)

Credits
-------

Credits go to [visionmedia](https://github.com/visionmedia)'s [ngen](https://github.com/visionmedia/ngen). The biggest difference from `ngen` and `scaff` is the ability to [pull down templates](#create-an-application) per project and the [generators](#using-a-generator). The templates for the most part should be compatible.

I also took inspiration from the [rails cli](http://guides.rubyonrails.org/command_line.html#rails-generate) for generating a bunch of boiler plate code with one command.
