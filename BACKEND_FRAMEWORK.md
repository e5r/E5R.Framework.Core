Framework Back-End
==================

Este documento descreve de forma breve parte da _Arquitetura para Desenvolvimento de Software_
do ***E5R Development Team***. Tal arquitetura é especializada e otimizada para o
desenvolvimento de softwares web, mas também permite o desenvolvimento de qualquer outro
tipo de software.

Aqui falaremos do Framework para Back-End.

## PERSISTÊNCIA

Sempre que falamos em persistência, lembramos dos bancos de dados relacionais, ORM`s e coisas
afins. Mas procuramos tratar a persistência da forma mais generalizada possível. Portanto, aqui
você se deparará com alguns conceitos que parecerão estranhos pra quem já é acostumado com a
persitência padrão de projetos C#/.NET, que é o SQL Server (ou outro banco) junto ao ADO ou
EntityFramework.

Quando encontar algo estranho a primeira vista, procure pensar na persistência sendo feita não
necessariamente em um banco de dados, mas em um sistema de arquivos ou em um repositório de 
arquivos distribuídos na rede, ou coisa assim. Talvez fique mais fácil absorver os conceitos.

Mas vamos lá. O modelo está centrado em alguns conceitos básicos.

São eles:

### Modelo de Dado

Um modelo de dado, ou simplesmente __DataModel__ é a abstração das propriedades de um objeto que
possa ser persistido e posteriormente usado. Trata-se de uma classe anêmica, ou crua, como
preferir.

O objetivo dessa classe é simplesmente conter as informações que podem ser persistidas em algum
meio. Não é objetivo dessa classe fazer operações, ou aplicar regras de negócio e coisas do
tipo; por isso, são classes que normalmente não conterão métodos, mas somente propriedades. Mas
é claro que podem haver pequenas operações, sejam para transformar dados ou fazer algum tipo
de operação auxiliar.

Mas tais operações nunca envolverão a própria persistência em si, ou algo do tipo. O ideal é (e
de fato é assim que tratamos aqui) que a persistência em si, e operações de negócio sejam feitas
por objetos de persistência (Storages) e de negócio (Business Services ou Business Objects).

Ainda temos o modelo de visão, ou `ViewModel`, que será tratado logo mais nesta mesma
documentação.

> Acho melhor você deixar para pensar nisso quando chegarmos lá.

Porém creio que seja importante ressaltar aqui que o modelo de visão (__ViewModel__) é semelhante
ao modelo de entidade (__Model__), porém cada um para o seu propósito (ou camada). Enquanto a
__ViewModel__ está para a tela, ou outro meio de visualização na camada de visão e/ou apresentação,
o __Model__ está para o mecanismo de persistência, mas precisamente entre a camada de negócio e
camada de persistência. O __Model__ seria _"tipo"_ um __DTO (Data Transfer Object)__, ou também
poderia ser comparado com um __DAO (Data Access Object)__

```csharp
/*

TODO: Continuar falando aqui! A ideia é falar de DTO (DataModel), e falar de Model, e como Model
é a base para DataModel e ViewModel via o conceito de ModelWrapper.

ModelWrapper é uma classe que envolve um Model, um ViewModel e um DataModel são ModelWrapper
de Model.

Ainda temos um DomainModel, que eu prefiro chamar de um BusinessObject (que também poderia se
chamar BusinessModel), que é na verdade um objeto de negócio que também envolve um Model (esse
é na verdade o nosso BusinessModel), portanto é um ModelWrapper. Mas o papel do mesmo é na
verdade representar o gráfico do negócio.

Pensando em um Blog. Logo temos o conceito de [BLOG] com as informações do ou dos blogs,
[POST] como sendo os artigos publicados no blog, e [COMMENT] como sendo os comentários que os
usuários fizeram em cada artigo publicado.

Isso deixa claro que nosso modelo de domínio (ou DomainModel, ou simplesmente Model no nosso
caso) tem três objetos, são eles: Blog, Post e Comment.

PS: Essa é a visão que temos quando aplicamos BDD. Identificamos nossos objetos de domínio.

Podemos supor as seguintes informações para cada um deles:

Blog {
    Owner
    Title
    Url
}

Post {
    Date
    Title
    Author
    Content
}

Comment {
    Date
    Title
    Author
    Text
}

Cada um desses objetos precisa fornecer tipos de informações específicas (e diferentes)
dependendo dos olhos que estão sobre eles.

Por exemplo:

Se você estiver olhando cada objeto com uma visão de persistência, você precisaria
de algo como:

Blog
{
    int BlogID
    int OwnerID
    varchar(60) Title
    varchar(200) Url

    // caso você use a ideia de auditoria das entidades
    datetime CreatedDate
    datetime UpdatedDate
    int CreatedUserID
    int UpdatedUserID

    // e caso você use a ideia  de exclusão lógica
    bit Deleted
}

Post
{
    int BlogID
    int PostID
    datetime Date
    varchar(60) Title
    int AuthorID
    text Content
    // [+] propriedades de auditoria e exclusão lógica
}

Comment
{
    int PostID
    int CommentID
    datetime Date
    int AuthorID
    varchar(60) Title
    varchar(200) Text
    // [+] propriedades de auditoria e exclusão lógica
}

Já, se os olhos são do ponto de visão de visão (camada de apresentação),
poderia ser esperado:

Blog
{
    [Display(Name = "Select a blog")]
    int BlogID
    string BlogName

    [Display(Name = "Select a owner")]
    int OwnerID
    string OwnerName

    [MaxLength(60)]
    [Display(Name = "Blog title")]
    string Title

    [MaxLength(200)]
    [Display(Name = "Blog URL")]
    [DataType(DataType.Url)]
    string  Url
}

Post
{
    [Display(Name = "Post data")]
    DateTime Date
    
    [Display(Name = "Post title")]
    [MaxLength(60)]
    string Title

    [Display(Name = "Post author")]
    [MaxLength(60)]
    string Author

    [Display(Name = "Post content")]
    string Content
}

Comment
{
    [Display(Name = "Data")]
    DateTime Date

    [Display(Name = "You name")]
    [MaxLength(60)]
    string Author

    [Display(Name = "Title")]
    [MaxLength(60)]
    string Title

    [Display(Name = "You comment")]
    string Text
}

Agora, se você estivesse olhando de uma perpectiva negocial, seria melhor
enxergar assim:

Blog {
    string Owner
    string Title
    string Url

    Post[] Posts
}

Post {
    DateTime Date
    string Title
    string Author
    string Content

    Blog Blog
    Comment[] Comments
}

Comment {
    DateTime Date
    string Title
    string Author
    string Text

    Post Post
    Comment[] Reply
}

Se nós observarmos, para cada perspectiva nós temos algumas informações diferentes para
cada objeto, vamos aqui observar somente o objeto Post para exemplificarmos:

Nosso objeto Post tem as seguintes informações: {Date, Title, Author, Content}

Mas para persistência, precisamos de informações de referência, ou seja, onde
temos o Author, na verdade em nosso banco (por exemplo) isso seria uma outra
tabela e nessa precisaríamos somente da referência, ou seja, [AuthorID].
Também precisaríamos de informações de auditoria, ou seja, [CreatedDate],
[UpdatedDate], [CreatedUserID], e [UpdatedUserID]. Além é claro de informações
para exclusão lógica ao invés de física, nesse caso, [Deleted].
Todos esses dados só tem importância para a persistência, para o negócio em si
não é importante do ponto de vista de uma apresentação para um cliente por exemplo.

Já para a visão, o importante mesmo são as anotações de nomes das labels para os
campos nos formulários, como [Display(Name = "Post title")], além é claro dos
dados para validação como [MaxLength(60)].

Já para uma visão negocial (tipo para uma apresentação visual de relações,
diagramas UML, apresentação PowerPoint) o que importa é saber que Blog tem uma lista
de Posts, e Post tem a referência a Blog além da lista de Comments, e Comment por sua
vez têm a referência de post e uma lista de outros Comments como Reply (respostas).
Isso faz ficar mais fácil entende o negócio e a relação entre seus objetos.

No fim o que interessa?

Interessa identificar nossos objetos de negócio de uma forma bastante primitiva.
Esse é o nosso __Model__, pois é a representação mais básica de cada objeto identificado.

Depois nós temos um objeto para cada camada, que tem essas informações básicas
do nosso modelo, porém com informações adicionais, ou com transformações adicionais,
para complementar como os dados devem ser vistos para cada camada, a saber:

Camada de persistência, Camada de Visão e Camada de Negócios.

No fim, todos esses outros objetos que não o __Model__ inicial, são nada mais nada mesmos
do que envelopes, que contém informações pertinentes a sua camada, mas que sempre
terão as informações primitivas envelopadas alí.

E como se dá a comunicação entre camadas?

Aí que entra esse conceito de __ModelWrapper__. Um __ModelWrapper__ é um objeto que sempre
tem dentro de si um __Model__. E como os nossos wrappers, independente da camada, sempre
conhecerão o __Model__ podemos dizer que esse é o mínimo comum entre todas as camadas,
e assim podemos considerá-lo como nosso DTO (Data Transfer Objetc), não o chamamos
simplesmente de DTO para não deteriorar o conceito de __ModelWrapper__ que é na verdade
nossa base.

Assim se você tem um objeto Post na camada Business e deseja enviar para a camada de Persistência,
seria algo como:

var dto = PostBusinessModel.ToModel()
CamadaPersistencia.Metodo(dto)

Lá na camada de persistência, podêmos então:

class CamadaPersistencia
{
    void Metodo(PostModel dto)
    {
        var dao = PostDataModel.FromModel(dto)
        // ...
    }
}

Com isso garantimos a comunicação entre as camadas.

*/
```

###


### Aggregate

Agregados são agrupamentos de repositórios ou armazens de dados.
Pensando em banco de dados relacionais, podemos dizer que um agregado é um agrupamento de
tabelas que estão relacionadas de alguma forma. Quando se executa uma operação, normalmente se
acessa várias tabelas, isso porque há vínculo entre as mesmas, seja físico ou negocial.
Então os agregados contextualizam os objetos envolvidos em operações semelhantes, dessa forma a
instanciação de "toda base de dados" nunca será necessária, aumentando a performance, principalmente
em aplicações web.

Correndo o risco de estragar todo o seu entendimento sobre o que pretendemos explicar aqui, vou me arriscar
e pedir para que pense em um agregado como um __Context__ do __EntityFramework__ se preferir, porque ele normalmente pendura os __DbSet<T>__, que por sua vez são os objetos que usamos para acessar os dados
de cada (e uma só) entidade no banco. Você logo perceberá várias diferenças, mas a princípio, se você
já desenvolve com EntityFramework, talvez isso te ajude a entender.

A interface **IAggregate** é a base para este conceito. Além de agrupar as os __Storages__ para as entidades
envolvidas no contexto, um agregado dá suporte a um outro conceito que veremos mais adiante, **UnitOfWork*;
para isso _IAggregate_ expôe os métodos _SaveChanges()_ que trabalha como um _Commit_ em base de dados relacionais, e o método _HasChanges()_, que verifica se existem mudanças passíveis de serem persistidas.

> TODO: Além destes métodos, temos ainda _Seed()_ que é usado para popular as tabelas como os dados iniciais,
> provido para inicialização de dados. Ainda estamos analisando o melhor local para aplicá-lo.

Veja abaixo a interface:

```csharp
interface IAggregate
{
    void SaveChanges();
    bool HasChanges();
    //void Seed();
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
comparando a uma base de dados relacional, seria agrupar várias operações em uma _Transaction_
e depois dar um _Commit_ ou _Rollback_ ao final. Este funciona em conjunto com o conceito de Agregado.

Você observou o construtor da class **BlogAggregate**?

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

    /*
     * Isso aqui pode fazer com que SaveChanges() e HasChanges()
     * deixem de existir em IAggregate. Porque o commit em si
     * na verdade ocorre na unidade de trabalho e não nos agregados.
     *
     * Os agregados em si seriam só atalhos mesmo para os Storages.
     *
     * Os agregados podem então repassar esses guardas de sessão
     * para seus Storages via esse GetSettion(), uma vez que o
     * agregado recebe um IUnitOfWork no construtor.
     *
     * Esse objeto é representado por uma interface vazia só pra
     * facilitar o uso de métodos de extensão que podem converter
     * o objeto real, que se trata de um simples Object para o
     * tipo da implementação.
     *
     * Em uma implementação EF do UoW, a unidade de trabalho
     * inicializa uma transaction, e repassa aos agregados.
     * Os agregados repassam para os Storages, que por sua vez
     * usam os "Context" em si, esses como recebem uma Transaction,
     * podem então operar sobre seu contexto na Transaction recebida
     * ao invés do uso padrão.
     *
     * Em uma implementação ADO, isso seria bastante parecido, porém
     * sem o uso de "Context", mas aqui o objeto de sessão poderia
     * ser uma combinação de Connection + Transaction, onde os Storages
     * quando recebessem pudessem operar no ADO com a Connection e
     * Transaction específica.
     *
     * Em uma implementação com Dapper por exemplo, poderia ser utilizado
     * o mesmo conceito que ADO, visto que Dapper roda em cima de ADO
     * por natureza.
     */
    IUnitOfWorkSessionGuard GetSession();
}

// Guarda de sessão da unidade de trabalho.
// Representaria um Transaction().
interface IUnitOfWorkSessionGuard {}
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
interface IStore<TDataModel, TIdenifier>  where T : DataModel<TIdenifier>
{
    IEnumerable<DataModelValidator<TDataModel>> GetValidators(StoreAction action);

    TDataModel Create(TDataModel model);
    TDataModel Replace(IDictionary<TIdenifier, TDataModel> model);
    void Remove(TIdentifier id);

    IEnumerable<TDataModel> BulkCreate(IEnumerable<TDataModel> models);
    IEnumerable<TDataModel> BulkReplace(IEnumerable<IDictionary<TIdenifier, TDataModel>> models);
    void BulkRemove(IEnumerable<TIdentifier> ids);

    IEnumerable<TDataModel> Get(Limiter limiter);
    TDataModel Find(TIdenifier id);
    IEnumerable<TDataModel> Search(Filter filter);
}
```

> TODO: Algumas notas sobre outros conceitos que complementam `IAggregate`.

```csharp
class ModelValidator<T> where T : DataModel
{
    Validate (IStore<T> store, T model) {}
}

class DataModel {}

class DataModel<TIdenifier> : DataModel
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