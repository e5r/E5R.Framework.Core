Framework Back-End
==================

Este documento descreve de forma breve parte da _Arquitetura para Desenvolvimento de Software_
do ***E5R Development Team***. Tal arquitetura é especializada e otimizada para o
desenvolvimento de softwares web, mas também permite o desenvolvimento de qualquer outro
tipo de software.

Aqui falaremos do Framework para Back-End.

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
interface IAggregate
{
    void SaveChanges();
    bool HasChanges();
    void Seed();
}
```

Uma aplicação de blog poderia ter uma implementação semelhante a essa:

```csharp
class BlogAggregate : IAggregate
{
    BlogAggregate(IUnitOfWork work)
    {
        work.AddAggregate(this);
    }
    
    void SaveChanges() { }
    void HasChanges() { }
    //void Seed() { }
    
    IStoreByInt<Blog> Blog { get; set; }
    IStoreByInt<Post> Post { get; set; }
    IStoreByInt<Comment> Comment { get; set; }
}
```

### UnitOfWork

Uma unidade de trabalho agrupa várias operações que devem ser realizadas de forma atômica,
comparando a uma base de dados relacional, seria agrupar várias operações e dar um _Commit_
ao final. Este funciona em conjunto com o conceito de Agregado. Você observou o construtor da
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
public interface IUnitOfWork
{
    void AddAggregate(IAggregate aggregate);
    void SaveWork();
}
```

### Storage

Um _Storage_ é um armazem de dados, e o conceito que aplica "o normalmente utilizado"
**Repository Pattern**, onde nós temos um local central para operar completamente em uma
_única entidade_.

O genérico **IStore** nos dá a base para implementar este conceito, ele disponibiliza os
métodos:

* **Get():** Retorna todos os itens da entidade, obedecendo a um limite (paginador);
* **Find():** Busca um único elemento com base em seu identificador;
* **Search():** Realiza uma busca com critérios;
* **Create():** Cria (adiciona) um novo item;
* **Replace():** Substitui (modifica) um elemento já existente com base em seu identificador;
* **Remove():** Remove um elemento existente com base em seu identificador;

E ainda temos os métodos que auxiliam a persistência em massa:

* **BulkCreate():** Cria (adiciona) um conjunto de novos itens;
* **BulkReplace():** Substitui (modifica) um conjunto de elementos já existentes com base em seu identificador;
* **BulkRemove():** Remove um conjunto de elementos existentes com base em seu identificador;

Observe o genérico:

```csharp
interface IStore<TModel, TIdenifier>  where T : Model<TIdenifier>
{
    IEnumerable<ModelValidator<TModel>> GetValidators(StoreAction action);

    TModel Create(TModel model);
    TModel Replace(IDictionary<TIdenifier, TModel> model);
    void Remove(TIdentifier id);

    IEnumerable<TModel> BulkCreate(IEnumerable<TModel> models);
    IEnumerable<TModel> BulkReplace(IEnumerable<IDictionary<TIdenifier, TModel>> models);
    void BulkRemove(IEnumerable<TIdentifier> ids);

    IEnumerable<TModel> Get(Limiter limiter);
    TModel Find(TIdenifier id);
    IEnumerable<TModel> Search(Filter filter);
}
```

> TODO: Algumas notas sobre outros conceitos que complementam `IAggregate`.

```csharp
class ModelValidator<T> where T : Model
{
    Validate (IStore<T> store, T model) {}
}

class Model {}

class Model<TIdenifier> : Model
{
    TIdenifier Id { get; set; }
}

interface IStoreByInt<T> : IStore<T, int> {}
interface IStoreByStr<T> : IStore<T, string> {}

class Limiter {} // Paginator
class Filter : Limiter {}

enum StoreAction
{
    Create,
    Replace,
    Destroy
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