Guia de Estilo (Style Guide)
============================

Este documento descreve de forma breve parte da _Arquitetura para Desenvolvimento de Software_
do ***E5R Development Team***. Tal arquitetura é especializada e otimizada para o
desenvolvimento de softwares web, mas também permite o desenvolvimento de qualquer outro
tipo de software.

Aqui falaremos do guia de estilo para codificação.

## Copyright

Todos os arquivos de código fonte devem iniciar com a nota de direitos autorais.

> C#, JavaScript/TypeScript, Jade Sass
```csharp
// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.
```

## Nomenclatura CSharp

*Arquivos*: PascalCase
*Namespaces*: PascalCase, Iniciando sempre com prefixo *E5R.Category.Product.Component*, onde:

* Category, pode ser uma das seguintes:
  * Framework, para bibliotecas publicas
  * Software, para produtos de software
  * Tools, para ferramentas diversas
* Product, nome do produto
* Component, nome do componente dentro do produto, ex:
  * Core
  * Business
  * UI
  
> TODO: Seguir C# Coding Standards
