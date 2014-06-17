App = Ember.Application.create();

App.Album = Ember.Object.extend({
  title: '',
  imgUrl: '',
  artist: null
});

App.Artist = Ember.Object.extend({
  name: '',
  imgUrl: '',
  toString: function() {
    return this.get('name');
  }
});

var sample_artists = [
  App.Artist.create({
    name: 'Kent',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/97759403/Kent+2014fEmilFagander_02500x33.jpg'
  }),
  App.Artist.create({
    name: 'Sólstafir',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/52647109/Slstafir.png'
  }),
  App.Artist.create({
    name: 'The Verve',
    imgUrl: 'http://userserve-ak.last.fm/serve/_/402611/The+Verve.jpg'
  }),
  App.Artist.create({
    name: 'Camera Obscura',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/60543725/Camera+Obscura+PNG.png'
  }),
  App.Artist.create({
    name: 'Spiritualized',
    imgUrl: 'http://userserve-ak.last.fm/serve/_/150972/Spiritualized.jpg'
  }),
  App.Artist.create({
    name: 'Thrawsunblat',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/87697953/Thrawsunblat+joelviolette.jpg'
  }),
  App.Artist.create({
    name: 'The Jam',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/29887139/The+Jam+all+mod+cons.jpg'
  }),
  App.Artist.create({
    name: 'M83',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/71481450/M83+3.png'
  }),
  App.Artist.create({
    name: 'Krallice',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/61806689/Krallice.png'
  }),
  App.Artist.create({
    name: 'Hakan Hellstrom',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/52943513/Hkan+Hellstrm++Andreas+hlund.jpg'
  }),
  App.Artist.create({
    name: 'Ulver',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/67319746/Ulver++PNG.png'
  }),
  App.Artist.create({
    name: 'Slowdive',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/96464657/Slowdive++better+miniature+prof.jpg'
  }),
  App.Artist.create({
    name: 'Hevisaurus',
    imgUrl: 'http://userserve-ak.last.fm/serve/500/36679583/Hevisaurus+3540292784_photo.jpg'
  })
];

var sample_album = App.Album.create({
  title: 'Sound Affects',
  artist: sample_artists[6]
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    // mock retrieving our sample album as the model
    return sample_album;
  }
});

App.IndexController = Ember.Controller.extend({
  artists: function() {
    // make available our list of artists to choose from
    return sample_artists;
  }.property()
})

App.ItemPickerComponent = Ember.Component.extend({
  query: '',
  _displayedResults: [],
  classNames: ['item-picker'],

  // after component is ready, pre-populate the default listing
  didInsertElement: function() {
    this.fire();
  },

  // Debounced observer. Watches for query changes, but will only act on them every 300ms.
  queryChanged: function() {
    Ember.run.debounce(this, this.fire, 300);
  }.observes('query'),

  fire: function() {
    var query = this.get('query');
    if (query.length > 0) { 
      results = [];
      query = ' ' + query.toUpperCase().trim();
      this.get('items').forEach(function(item, index) {
        var match_str = ' ' + item.toString().toUpperCase();
        var pos = match_str.indexOf(query);
        if (pos !== -1) {
          results.push(item);
        }
      });
      this.set('_displayedResults', results);
    }
    else {
      this.set('_displayedResults', this.get('items'));
    }
  },

  activate: function() {
    if (this.get('active') !== true) {
      var eventNamespace = 'click.' + Ember.guidFor(this);
      var self = this;
      var container = this.$();

      // bind event handler to entire document to check for clicks outside component.
      $(document).on(eventNamespace, function(e) {
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          self.deactivate();
        }
        return false;
      });

      this.set('active', true);
      this.$('#dropdown-body').show();
      this.$('#dropdown-query-input').focus();
    }
  },

  deactivate: function() {
    if (this.get('active') !== false) {
      this.set('query', '');
      var eventNamespace = 'click.' + Ember.guidFor(this);
      $(document).off(eventNamespace);
      this.$('#dropdown-body').hide();
      this.set('active', false);
    }
  },

  actions: {
    toggle: function() {
      if (this.get('active')) { this.deactivate(); }
      else { this.activate(); }
    },
    pick: function(item) {
      this.set('selected', item);
      this.deactivate();
    }
  }

});

App.ItemView = Ember.View.extend({
  classNames: 'dropdown-result',
  templateName: 'views/item-view',
  click: function() {
    this.get('controller').send('pick', this.get('content'));
  }
});
