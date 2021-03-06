/*
 * Copyright 2013 Memorial-Sloan Kettering Cancer Center.
 *
 * This file is part of PCViz.
 *
 * PCViz is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PCViz is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with PCViz. If not, see <http://www.gnu.org/licenses/>.
 */

var EdgeInfoView = Backbone.View.extend({
    template: _.template($("#edgeinfo-template").html()),
    render: function() {
        var model = this.model;
        model["summary"] = _.template($("#edge-" + model.type + "-template").html(), model);
        this.$el.append(this.template(model));

        var pmidCont = this.$el.find("ul.pubmed-list");
        _.each(model.pubmed, function(pmid) {
            (new PubMedView({
                el: pmidCont,
                model: { pmid: pmid }
            })).render();
        });

        var dataSrcCont = this.$el.find("ul.datasrc-list");
        _.each(model.datasource, function(aSource) {
            (new DataSourceView({
                el: dataSrcCont,
                model: {
                    source: aSource,
                    metadata: window.metadata
                }
            })).render();
        });

        (new BlinkDetailsTabView()).render();

        var detailsText = _.template($("#edge-type-text-" + model.type + "-template").html(), model);
        this.$el.find(".type-actual-text").html(detailsText);

        $(".type-filter-help").tooltip({
            placement: 'right',
            html: true,
            title: function() {
                var type = $(this).data("edge-type");
                return _.template($("#edge-type-example-template").html(), { type: type });
            }
        });

        return this;
    }
});

var DataSourceView = Backbone.View.extend({
    template: _.template($("#datasrc-id-template").html()),

    render: function() {
        this.$el.append(this.template(this.model));
    }
});

var PubMedView = Backbone.View.extend({
    template: _.template($("#pubmed-id-template").html()),

    render: function() {
        this.$el.append(this.template(this.model));
    }
});
