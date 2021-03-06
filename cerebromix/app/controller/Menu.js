Ext.define('CerebroMix.controller.Menu', {
    extend: 'Ext.app.Controller',

    models: [
        'menu.Root',
        'menu.Item'
    ],
    stores: [
        'Menu'
    ],
    views: [
        'menu.MainMenu',
        'menu.Item'
    ],
    refs: [{
        ref: 'mainPanel',
        selector: 'mainpanel'
    }],

    onPanelRender: function(abstractcomponent, options) {
        this.getMenuStore().load(function(records, op, success) {

            var menuPanel = Ext.ComponentQuery.query('mainmenu')[0];

            Ext.each(records, function(root) {

                var menu = Ext.create('CerebroMix.view.menu.Item', {
                    title: root.get('title'),
                    glyph: root.get('iconCls')
                });

                Ext.each(root.items(), function(itens) {

                    Ext.each(itens.data.items, function(item) {

                        menu.getRootNode().appendChild({
                            text: item.get('text'),
                            leaf: true,
                            iconCls: root.get('iconCls'),
                            id: item.get('id'),
                            className: item.get('className')
                        });
                    });
                });

                menuPanel.add(menu);
            });
        });
    },

    onTreepanelSelect: function(selModel, record, index, options) {
        //console.log(record.raw.className);

        var mainPanel = this.getMainPanel();

        var newTab = mainPanel.items.findBy(
            function(tab) {
                return tab.title === record.get('text');
            });

        //console.log(record.raw.className);
        if (mainPanel.items.getCount(newTab) > 1 && !newTab) {
            mainPanel.remove(mainPanel.items.getAt(1), true);
            // console.log('teste');
        };

        if (!newTab) {
            newTab = mainPanel.add({
                xtype: record.raw.className,
                closable: true,
                glyph: record.get('iconCls'),
                title: record.get('text')
            });

        }
        mainPanel.setActiveTab(newTab);
    },

    onTreepanelItemClick: function(view, record, item, index, event, options) {
        this.onTreepanelSelect(view, record, index, options);
    },

    init: function(application) {
        this.control({
            "mainmenu": {
                render: this.onPanelRender
            },
            "mainmenuitem": {
                //select: this.onTreepanelSelect,
                itemclick: this.onTreepanelItemClick
            }
        });
    }

});
