
/**
 * Module dependencies
 */
var spawn = require('child_process').spawn
  , join = require('path').join
  , fs = require('fs')
  , async = require('async');

/**
 * Defines
 */
var SCAFF_DIR = ".scaff";

exports.fetch = function fetch(url, directory, done) {
  var args = ["clone", url, join(directory, SCAFF_DIR, "template")]
    , child = spawn("git", args, {stdio: 'inherit'});
  child.on("exit", function(err) {
    done(err);
  });
};

exports.createConfig = function createConfig(url, directory, done) {
  var config = {
    template: url
  };
  fs.writeFile(join(directory, SCAFF_DIR, "config"), JSON.stringify(config), done);
};

exports.open = function open(directory, done) {
  try {
    done(null, require(join(directory, SCAFF_DIR, "template")));
  }
  catch (e) {
    done(e);
  }
};

exports.prompt = function prompt(template, directory, defaults, done) {
  console.log();
  console.log('\033[36m'+(template.title || "Enter Project Information:")+'\033[0m');
  var responses = defaults || {};
  async.forEachSeries(Object.keys(template.variables), function(key, next) {
    var desc = template.variables[key];
    if (typeof desc == "function") {
      desc(responses, done);
    }
    else {
      ask(desc, function(value) {
        responses[key] = value;
        next();
      });
    };
  }, function(err) {
    process.stdin.destroy();
    done(err, responses);
  });
};

exports.files = function files(directory, generator, done) {
  var contentPath
    , files = []
    , directories = [];

  if (typeof generator == "function") {
    done = generator;
    contentPath = join(directory, SCAFF_DIR, "template", "content");
  }
  else {
    contentPath = join(directory, SCAFF_DIR, "template", "generators", generator, "content");
  }

  // TODO make async
  (function next(dir) {
    fs.readdirSync(dir).forEach(function(file){
      files.push(file = dir + '/' + file);
      var stat = fs.statSync(file);
      if (stat.isDirectory()) {
        directories[file] = true;
        next(file);
      }
    });
  })(contentPath);

  done(null, contentPath, files, directories);
};

exports.create = function create(directory, contentPath, files, directories, responses, done) {
  console.log();
  files.forEach(function(file) {
    var path = parse(file, responses)
      , out = join(directory, path.replace(contentPath, ''));

    // directory
    if (directories[file]) {
      try {
        fs.mkdirSync(out, 0775);
        console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
      }
      catch (e) {
        // ignore
      }
    }
    // file
    else {
      var str = parse(fs.readFileSync(file, 'utf8'), responses);
      fs.writeFileSync(out, str);
      console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
    };
  });
  console.log();
}

// TODO allow template to define delimeter
function parse(str, responses) {
  return str
    .replace(/\{\{([^}]+)\}\}/g, function(_, key){
      return responses[key];
    });
};

/**
 * Ask for user input.
 */

function ask(desc, callback) {
  process.stdout.write('  \033[90m' + desc + '\033[0m');
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', callback).resume();
}