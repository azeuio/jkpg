const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

function readJsonFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier JSON: ${filePath}`, error);
    return [];
  }
}

function loadRoutesConfigs(configDir) {
  const files = fs.readdirSync(configDir);
  const routesConfig = [];

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(configDir, file);
      const config = readJsonFile(filePath);
      routesConfig.push(...config);
    }
  });

  return routesConfig;
}

function loadMiddlewares(dir) {
  const middlewares = {};
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('Middleware.js')) {
      const middlewareName = file.replace('Middleware.js', '');
      try {
        middlewares[middlewareName] = require(path.join(dir, file));
      } catch (error) {
        console.error(`Erreur lors du chargement du middleware: ${file}`, error);
      }
    }
  });
  return middlewares;
}

function loadControllers(dir) {
  const controllers = {};
  const files = fs.readdirSync(dir);
  
  console.log('Fichiers trouvés dans controllers:', files);

  files.forEach(file => {
    if (file.endsWith('Controller.js')) {
      const controllerName = file.replace('Controller.js', '');
      try {
        controllers[controllerName] = require(path.join(dir, file));
        console.log(`Contrôleur chargé: ${controllerName}`);
      } catch (error) {
        console.error(`Erreur lors du chargement du contrôleur: ${file}`, error);
      }
    }
  });
  return controllers;
}


const controllers = loadControllers(path.resolve(__dirname, '../controllers'));

const middlewares = loadMiddlewares(path.resolve(__dirname, '../middlewares'));

const routesConfig = loadRoutesConfigs(path.resolve(__dirname, './config'));

console.log('Contrôleurs chargés:', Object.keys(controllers));

console.log('Middlewares chargés:', Object.keys(middlewares));
console.log('Contenu des middlewares:', middlewares);

console.log('Configurations des routes:', routesConfig);

routesConfig.forEach(route => {
  const routeMiddlewares = [];

  console.log(`Traitement de la route: ${route.path} avec méthode: ${route.method}`);

  if (route.middleware) {
    const middlewareNames = route.middleware.split(',').map(name => name.trim());

    middlewareNames.forEach(name => {
      const parts = name.split('.');

      if (parts.length === 2) {
        const middlewareFile = parts[0];
        const middlewareFunc = parts[1];

        if (middlewares[middlewareFile] && middlewares[middlewareFile][middlewareFunc]) {
          console.log(`Middleware trouvé: ${name} pour la route ${route.path}`);
          routeMiddlewares.push(middlewares[middlewareFile][middlewareFunc]);
        } else {
          console.error(`Middleware non trouvé: ${name} pour la route ${route.path}`);
        }
      }
    });
  }

  console.log(`Middlewares spécifiés pour la route ${route.path}: ${route.middleware}`);

  const [controllerName, methodName] = route.controller.split('.');

  if (controllers[controllerName] && controllers[controllerName][methodName]) {
    console.log(`Contrôleur: ${controllerName}, Méthode: ${methodName}`);
    console.log(`Configuration de la route: ${route.method.toUpperCase()} ${route.path}`, routeMiddlewares, controllers[controllerName][methodName]);

    switch (route.method.toLowerCase()) {
      case 'post':
        router.post(route.path, ...routeMiddlewares, controllers[controllerName][methodName]);
        break;
      case 'put':
        router.put(route.path, ...routeMiddlewares, controllers[controllerName][methodName]);
        break;
      case 'delete':
        router.delete(route.path, ...routeMiddlewares, controllers[controllerName][methodName]);
        break;
      case 'get':
        router.get(route.path, ...routeMiddlewares, controllers[controllerName][methodName]);
        break;
      default:
        console.error(`Méthode HTTP non supportée: ${route.method}`);
    }
  } else {
    console.error(`Contrôleur ou méthode non trouvée: ${route.controller}`);
  }
});



module.exports = router;
