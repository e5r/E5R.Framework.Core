Arquitetura
===========

Este documento descreve de forma breve a _Arquitetura para Desenvolvimento de Software_
do ***E5R Development Team***. Tal arquitetura é especializada e otimizada para o
desenvolvimento de softwares web, mas também permite o desenvolvimento de qualquer outro
tipo de software. E para isso usamos a seguinte pilha:

### Backend

* ASP.NET 5
* ASP.NET MVC 6
* EntityFramework 7
* C#

### Frontend

* HTML5
* Angular 2
* Bootstrap 4
* Jade
* SASS
* TypeScript

## Build

* NodeJS
* Windows Command
* Shell Script
* Gulp Task
* TSD
* JavaScript
* NPM

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

### ARCHTECTURE.MD

Este arquivo. Que descreve a arquitetura para o desenvolvimento do software.

### LICENSE.txt

Informações de licença do produto.

### NEWS.MD

Notícias quanto a evolução do desenvolvimento do produto. Changelog.

### README.MD

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

# Guidelines

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

## SRC/E5R.FRAMEWORK.CORE

Este componente é a base do desenvolvimento **backend** de softwares que persistem dados de
alguma maneira.

O modelo está centrado 4 conceitos. São eles:

### Aggregate

Agregados são agrupamentos de repositórios ou armazens de dados.
Pensando em banco de dados relacionais, podemos dizer que um agregado é um agrupamento de
tabelas que estão relacionadas de alguma forma. Quando se executa uma operação, normalmente se
acessa várias tabelas, isso porque há vínculo entre as mesmas, seja físico ou negocial.
Então os agregados contextualizam os objetos envolvidos em operações semelhantes, dessa forma a
instanciação de "toda base de dados" nunca será necessária, aumentando a performance, principalmente
em aplicações web.

A interface **IAggregate** é a base para este conceito. Além de agrupar as entidades, um agregado dá
suporte a um outro conceito que veremos mais abaixo, **UnitOfWork*; para isso _IAggregate_ expôe os
métodos _SaveChanges()_ que trabalha como um _Commit_ em base de dados relacionais, o método
_HasChanges()_ verifica se existem mudanças passíveis de serem persistidas. Além destes métodos, temos
ainda _Seed()_ que é usado para popular as tabelas como os dados iniciais, provido para inicialização
de dados.

Veja abaixo a interface:

```csharp
// IAggregate.cs
public interface IAggregate
{
    void SaveChanges();
    bool HasChanges();
    void Seed();
}
```

Uma aplicação de blog poderia ter uma implementação semelhante a essa:

```csharp
public class BlogAggregate : IAggregate
{
    public BlogAggregate(IUnitOfWork work)
    {
        work.AddAggregate(this);
    }
    
    public void SaveChanges() { }
    public void HasChanges() { }
    public void Seed() { }
    
    public IOrderedQueryable<Blog> Blogs { get; set; }
    public IOrderedQueryable<Post> Posts { get; set; }
    public IOrderedQueryable<Comment> Comments { get; set; }
}
```

### UnitOfWork

Uma unidade de trabalho agrupa várias operações que devem ser realizadas de forma atômica,
comparando a uma base de dados relacional, seria agrupar várias operações e dar um _Commit_
ao final. Este funciona em conjunto com o conceito de Agregado, você observou o construtor da
class **BlogAggregate**?

```csharp
public BlogAggregate(IUnitOfWork work)
{
    work.AddAggregate(this);
}
```

Quando um agregado é instanciado, ele é adicionado a unidade de trabalho atual (existe uma por
requisição em uma aplicação web), e quando o trabalho da unidade de trabalho é salvo, todas as
operações executadas nos agregados instanciados também são confirmados.

A interface **IUnitOfWork** define essas operações:

```csharp
// IUnitOfWork.cs
public interface IUnitOfWork
{
    void AddAggregate(IAggregate aggregate);
    void SaveWork();
}
```

### Storage

Um _Storage_ é um armazem de dados, e o conceito que aplica o normalmente utilizado
**Repository Pattern**, onde nós temos um local central para operar completamente em uma
_única entidade_.

O genérico **IStore** nos dá a base para implementar este conceito, ele disponibiliza os
métodos:

* **Get():** Retorna todos os itens da entidade;
* **Search():** Realiza uma busca com critérios;
* **Find():** Busca um único elemento com base em seu ID;
* **Add():** Adiciona um novo elemento;
* **Modify():** Modifica um elemento já existente com base em seu ID;
* **Remove():** Remove um elemento existente com base em seu ID;

Observe o genérico:

```csharp
// IStore`2.cs
public interface IStore<TEntity, TIdentifier>
{
    IEnumerable<TEntity> Get();
    IEnumerable<TEntity> Search(Expression<Func<TEntity, bool>> where);
    TEntity Find(TIdentifier id);
    TEntity Add(TEntity entity);
    TEntity Modify(TIdentifier id, TEntity entity);
    void Remove(TIdentifier id);
}
```

Um **Storage** se utiliza dos **agregados** para obter e persistir os dados. E uma
implementação de exemplo para posts em nossa aplicação de blog poderia ser assim:

```csharp
public class Post
{
    public int PostId { get; set; }
    public string Content { get; set; }
}

public class PostStore : IStore<Post, int>
{
    private readonly BlogAggregate _aggregate;
    
    public PostStore(BlogAggregate aggregate)
    {
        _aggregate = aggregate;
    }
    
    public IEnumerable<Post> Search(Expression<Func<Post, bool>> where)
    {
        return _aggregate.Posts.Where(where);
    }
    
    public Post Modify(int id, Post entity)
    {
        var existEntity = Find(id);
        
        if(existEntity == null) {
            throw new NotFoundException(nameof(Post), id);
        }
        
        existEntity.Content = entity.Content;
    }
    
    // ...
}
```

### ViewModel

**Modelo de Visão** é um conceito que determina: um **Modelo** é um objeto de negócio com
tudo que é necessário para atender as regras, porém este mesmo modelo precisa transitar entre
várias requisições para completar as inúmeras operações, essas operações na grande maioria
das vezes não se utilizam de todos os atributos do **Modelo de Negócio**.

Por exemplo: para alterar a senha de um usuário, você precisará do ID deste usuário, a nova senha
e a confirmação da senha anterior; mas o nome do usuário, data de nascimento, etc., são desnecessários.

E em várias outras operações com o mesmo **Modelo de Negócio** vão exigir propriedades diferentes.
E é aí que entre o **Modelo de Visão**, onde você define as propriedades do **Modelo de Negócio** que
serão necessárias em determinada operação. O principal benefício de usar o **Modelo de Visão** nas
requisições ao invés do próprio **Modelo de Negócio** é compactação dos dados transitados, aumentando
a performance em tempo de resposta nas requisições; mas também tem o benefício de evitar o problema
de referência circular, muito comum em serialização de objetos, além da simplificação dos modelos
em cada contexto de aplicação, e muito mais.

O modelo de visão é uma implamentação de cada aplicação, mas o genérico **ViewModel** está contido
no core da arquitetura (veja o arquivo _ViewModel`2.cs_ para auxiliar sua implementação.

Tendo em mente o modelo de negócio para usuários abaixo:

```csharp
public class User
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastUpdated { get; set; }
    public User CreatedBy { get; set; }
    public IList<string> Claims { get; set; }
}
```

E imaginando uma tela que permite alterar a senha, poderíamos usar um modelo de visão como este:

```csharp
public class UserModifyPassowrdView : ViewModel<UserModifyPassowrdView, User>
{
    public int UserId
    {
        get { return Model.UserId; }
        set { model.UserId = value; }
    }
    
    public string NewPassword
    {
        get { return Model.Password; }
        set { Model.Password = value; }
    }
    
    public string ConfirmPassword {get; set; }
    
    public UserModifyPassowrdView()
    {
        Rules.Add(new ViewRule {
            Code = "RA-57",
            Description = "Confirmação de senha deve combinar com nova senha",
            ForceBreak = True,
            Checker = () => {
                return View.ConfirmPassword == Model.Password;
            }
        });
    }
}
```