$(function() {

    var Mensagem = Backbone.Model.extend({
        url: '/mensagem',

        idAttribute: '_id',
 
        defaults: {
            nome: 'Aqui vem o nome',
            mensagem: 'Mensagens',
            dataEnvio: new Date()
        }
    });

    var ItemDeMensagemView = Backbone.View.extend({

        tagName: 'div',

        template: _.template($('#templateItemMensagem').html()),

        events: {
            'click .editar': 'editarMensagem',
            'click .apagar': 'apagarMensagem'
        },

        editarMensagem: function () {
            var mensagem = prompt('Digite o novo conteúdo da mensagem', this.model.get('mensagem'));
            if (!mensagem) return;

            this.model.set('mensagem', mensagem);
        },

        apagarMensagem: function () {
            this.model.destroy();
        },

        remover: function () {
            this.$el.remove();
        },

        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remover, this);
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.attributes));
        }
    });

    var ColecaoDeMensagens = Backbone.Collection.extend({
        model: Mensagem
    });

    var NovaMensagemView = Backbone.View.extend({
        el: '#novaMensagem',

        events: {
            'submit': 'novaMensagem'
        },

        novaMensagem: function (event) {
            event.preventDefault();

            var mensagem = new Mensagem({
                'nome': this.$el.find('.nome').val(),
                'mensagem': this.$el.find('.mensagem').val(),
                'dataEnvio': new Date() // Definir a data de envio como a data atual
            });
            
            this.collection.add(mensagem);
            this.$el.find('.nome').val('');
            this.$el.find('.mensagem').val('');
        }
    });

    var CaixaDeEntradaView = Backbone.View.extend({
        tagName: 'div',

        initialize: function () {
            this.collection.on('add', this.adicionarUm, this);
        },

        adicionarUm: function (mensagem) {
            var mensagemView = new ItemDeMensagemView({ model: mensagem });
            this.$el.append(mensagemView.el);
        },

        render: function () {
            this.collection.each(this.adicionarUm, this);
            return this;
        }
    });

    var RoteadorDaAplicacao = Backbone.Router.extend({
        routes: {
            '': 'index',
            'ver/:id': 'ver',
            'editar': 'editar',
            'tweet': 'mostrarTweet',
            '*default': 'index'
        },

        mostrarTweet: function () {
            console.log('Mostrando tweets');

            var colecaoDeClientes = new ColecaoDeClientes();
            colecaoDeClientes.fetch();
            new VisualizarClientesView({ collection: colecaoDeClientes });
            console.log(colecaoDeClientes);
        },

        ver: function (id) {
            console.log('Visualizando item ', id);
            var m1 = new Mensagem();
            m1.save();
        },

        editar: function () {
            console.log('Rota de edição adicionada');
        },

        index: function () {
            console.log('Rota de índice adicionada');
            var mensagens = new ColecaoDeMensagens([
            ]);

            new NovaMensagemView({ collection: mensagens });

            var caixaDeEntrada = new CaixaDeEntradaView({ collection: mensagens });
            $('#pagina').html(caixaDeEntrada.render().el);
        }
    });
    
    new RoteadorDaAplicacao();
    Backbone.history.start();

});