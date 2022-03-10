// uncomment to develop locally
//import './index.css';

//import { JSONSchemaForSchemaStoreOrgCatalogFiles } from '@schemastore/schema-catalog';
import { CancellationToken } from 'monaco-editor/esm/vs/base/common/cancellation';
import { getDocumentSymbols } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols';
import {
  editor,
  Environment,
  languages,
  Position,
  Range,
  Uri,
} from 'monaco-editor/esm/vs/editor/editor.api';
import { SchemasSettings, setDiagnosticsOptions } from 'monaco-yaml';

// NOTE: This will give you all editor featues. If you would prefer to limit to only the editor
// features you want to use, import them each individually. See this example: (https://github.com/microsoft/monaco-editor-samples/blob/main/browser-esm-webpack-small/index.js#L1-L91)
import 'monaco-editor';

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
      case 'yaml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
      case 'json':
        return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
      default:
        throw new Error(`Unknown label ${label}`);
    }
  },
};

const subredditSchema = `${document.location.origin}/schemas/App.json`;
const operatorSchema = `${document.location.origin}/schemas/OperatorConfig.json`;

// https://github.com/microsoft/monaco-editor/issues/365#issuecomment-293722270
const yamlSchemas = [
  {
    uri: subredditSchema,
    fileMatch: ['bot.yaml'],
  },
  {
    uri: operatorSchema,
    fileMatch: ['app.yaml'],
  }
];

const jsonSchemas = [
  {
    uri: subredditSchema,
    fileMatch: ['bot.json'],
  },
  {
    uri: operatorSchema,
    fileMatch: ['app.json'],
  }
];

setDiagnosticsOptions({
  schemas: yamlSchemas,
});

languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  allowComments: true,
  trailingCommas: "ignore",
  schemas: jsonSchemas,
  enableSchemaRequest: true,
});

// @ts-ignore
window.meditor = editor;

const value = `
# Copy + paste your configuration here to get
# formatting, YAML syntax, annotated properties and automatic validation of your configuration
`.replace(/:$/m, ': ');

const ed = editor.create(document.getElementById('editor'), {
  minimap: {
    enabled: false
  },
  automaticLayout: true,
  model: editor.createModel(' ', 'yaml', Uri.parse('bot.yaml')),
  theme: 'vs-dark',
});

// @ts-ignore
window.ed = ed;
// @ts-ignore
window.muri = Uri;

const select = document.getElementById('schema-selection') as HTMLSelectElement;

const option = document.createElement('option');
option.value = 'app.yaml';
option.textContent = 'Operator'
select.append(option)

setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: true,
  format: true,
  hover: true,
  completion: true,
  schemas: yamlSchemas,
});

// fetch('https://www.schemastore.org/api/json/catalog.json').then(async (response) => {
//   if (!response.ok) {
//     return;
//   }
//   const catalog = (await response.json()) as JSONSchemaForSchemaStoreOrgCatalogFiles;
//   const schemas = [defaultSchema];
//   catalog.schemas.sort((a, b) => a.name.localeCompare(b.name));
//   for (const { fileMatch, name, url } of catalog.schemas) {
//     const match =
//       typeof name === 'string' && fileMatch?.find((filename) => /\.ya?ml$/i.test(filename));
//     if (!match) {
//       continue;
//     }
//     const option = document.createElement('option');
//     option.value = match;
//
//     option.textContent = name;
//     select.append(option);
//     schemas.push({
//       fileMatch: [match],
//       uri: url,
//     });
//   }
//
//   setDiagnosticsOptions({
//     validate: true,
//     enableSchemaRequest: true,
//     format: true,
//     hover: true,
//     completion: true,
//     schemas,
//   });
// });

// var searchParams = new URLSearchParams(window.location.search);
// let dlUrl = searchParams.get('url');
// if(dlUrl === null && searchParams.get('subreddit') !== null) {
//   dlUrl = `${document.location.origin}/config/content${document.location.search}`
// }
//
// if(searchParams.get('schema') === 'operator') {
//   // @ts-ignore
//   document.querySelector('#schema-selection').value = 'app.yaml';
// }

// if(dlUrl !== null) {
//   // @ts-ignore
//   document.querySelector('#configUrl').value = dlUrl;
//   fetch(dlUrl).then((resp) => {
//     if(!resp.ok) {
//       resp.text().then(data => {
//         document.querySelector('#error').innerHTML = `Error occurred while fetching configuration => ${data}`
//       });
//     } else {
//       resp.text().then(data => {
//         const oldModel = ed.getModel();
//         oldModel.dispose();
//         // @ts-ignore
//         const newModel = editor.createModel(data, 'yaml', Uri.parse(document.querySelector('#schema-selection').value));
//         ed.setModel(newModel);
//       })
//     }
//   });
// }
//
// document.querySelector('#loadConfig').addEventListener('click', (e) => {
//   e.preventDefault();
//   // @ts-ignore
//   const newUrl = document.querySelector('#configUrl').value;
//   fetch(newUrl).then((resp) => {
//     if(!resp.ok) {
//       resp.text().then(data => {
//         document.querySelector('#error').innerHTML = `Error occurred while fetching configuration => ${data}`
//       });
//     } else {
//       var sp = new URLSearchParams();
//       // @ts-ignore
//       sp.append('schema', document.querySelector('#schema-selection').value === 'bot.yaml' ? 'bot' : 'operator' );
//       sp.append('url', newUrl);
//       sp.append('format', 'yaml');
//       history.pushState(null, '', `${window.location.pathname}?${sp.toString()}`);
//       resp.text().then(data => {
//         const oldModel = ed.getModel();
//         oldModel.dispose();
//         // @ts-ignore
//         const newModel = editor.createModel(data, 'yaml', Uri.parse(document.querySelector('#schema-selection').value));
//         ed.setModel(newModel);
//       })
//     }
//   });
// });

// select.addEventListener('change', () => {
//
//   var searchParams = new URLSearchParams(window.location.search);
//   searchParams.set('schema', select.value === 'bot.yaml' ? 'bot' : 'operator')
//   history.pushState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
//   const oldModel = ed.getModel();
//   const newModel = editor.createModel(oldModel.getValue(), 'yaml', Uri.parse(select.value));
//   ed.setModel(newModel);
//   oldModel.dispose();
// });

function* iterateSymbols(
  symbols: languages.DocumentSymbol[],
  position: Position,
): Iterable<languages.DocumentSymbol> {
  for (const symbol of symbols) {
    if (Range.containsPosition(symbol.range, position)) {
      yield symbol;
      yield* iterateSymbols(symbol.children, position);
    }
  }
}

ed.onDidChangeCursorPosition(async (event) => {
  if(ed.getModel().getLanguageId() === 'json') {
    return;
  }
  const breadcrumbs = document.getElementById('breadcrumbs');
  const symbols = await getDocumentSymbols(ed.getModel(), false, CancellationToken.None);
  while (breadcrumbs.lastChild) {
    breadcrumbs.lastChild.remove();
  }
  for (const symbol of iterateSymbols(symbols, event.position)) {
    const breadcrumb = document.createElement('span');
    breadcrumb.setAttribute('role', 'button');
    breadcrumb.classList.add('breadcrumb');
    breadcrumb.textContent = symbol.name;
    breadcrumb.title = symbol.detail;
    if (symbol.kind === languages.SymbolKind.Array) {
      breadcrumb.classList.add('array');
    } else if (symbol.kind === languages.SymbolKind.Module) {
      breadcrumb.classList.add('object');
    }
    breadcrumb.addEventListener('click', () => {
      ed.setPosition({
        lineNumber: symbol.range.startLineNumber,
        column: symbol.range.startColumn,
      });
      ed.focus();
    });
    breadcrumbs.append(breadcrumb);
  }
});

editor.onDidChangeMarkers(([resource]) => {
  const problems = document.getElementById('problems');
  const markers = editor.getModelMarkers({ resource });
  while (problems.lastChild) {
    problems.lastChild.remove();
  }
  for (const marker of markers) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'button');
    const codicon = document.createElement('div');
    const text = document.createElement('div');
    wrapper.classList.add('problem');
    codicon.classList.add('codicon', 'codicon-warning');
    text.classList.add('problem-text');
    text.textContent = marker.message;
    wrapper.append(codicon, text);
    wrapper.addEventListener('click', () => {
      ed.setPosition({ lineNumber: marker.startLineNumber, column: marker.startColumn });
      ed.focus();
    });
    problems.append(wrapper);
  }
});
