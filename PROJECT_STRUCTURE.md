Estrutura do projeto
====================

Este documento descreve de forma breve parte da _Arquitetura para Desenvolvimento de Software_
do ***E5R Development Team***. Tal arquitetura é especializada e otimizada para o
desenvolvimento de softwares web, mas também permite o desenvolvimento de qualquer outro
tipo de software.

Aqui falaremos da estrutura do projeto.

## Diretórios do projeto

São 4 (quatro) diretórios principais que se encontram na raiz de cada projeto
**E5R Development Team**.

### DOC

Documentação dos componentes. Um subdiretório para a documentação de cada componente.
Nomenclatura: E5R.Catetory.SoftwareName.Component.Doc

### SRC

Componentes do software. Um subdiretório para cada componente de software.
Nomenclatura: E5R.Catetory.SoftwareName.Component

### TEST

Testes automatizados para os componentes de software, subdivididos em duas categorias
(subdiretórios).

#### FUNCTIONALS

Testes funcionais, ou unitários. Um subdiretório para cada componente.
Nomenclatura: E5R.Catetory.SoftwareName.Component.Test

#### E2E

Testes fim a fim. Um subdiretório para cada componente.
Nomenclatura: E5R.Catetory.SoftwareName.Component.Test.E2E

### TOOLS

Local para ferramentas necessárias para automação de tarefas build. Aqui ficam alguns
scripts compartilhados normalmente pelas tarefas de build, integração contínua, testes
unitários, liberações, etc.

## Arquivos do projeto

Todos os arquivos que estão na raiz do projeto, não são considerados código fonte do
produto, mas são códigos e informações do projeto, necessários para a construção do mesmo.

Os arquivos de informação são:

### PROJECT_STRUCTURE.md

Este arquivo. Que descreve a estrutura do projeto, com suas pastas, arquivos e significados.

### BACKEND_FRAMEWORK.md

Descreve os componentes do framework no lado do servidor (__Back-End__).

### FRONTEND_FRAMEWORK.md

Descreve os componentes do framework no lado do cliente (__Front-End__).

### STYLEGUIDE

Descreve o guia de estilo para codificação.

### LICENSE.txt

Informações de licença do produto.

### NEWS.md

Notícias quanto a evolução do desenvolvimento do produto. Changelog.

### README.md

Descrição do projeto, com informações básicas sobre a construção, autoria, propósito,
e link para demais informações.

### GLOBAL.JSON

Arquivo com configurações globais para os componentes de **backend** .NET.

### CONFIG.JS

Configurações de ambiente para execução das tarefas de construção.

### GULPFILE.JS

Tarefas de construção Gulp Tasks.

### PACKAGE.JSON

Metadados do projeto e dependências NODEJS/NPM necessárias para as atividades de construção.

### TSCONFIG.JSON

Configurações do compilador TypeScript.
