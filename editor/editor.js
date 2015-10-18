var editor = (function() {

  var dnacode = CodeMirror.fromTextArea(document.getElementById('dna-content'),
      {
        lineNumbers : true,
      });

  $('#editor-panel').children().hide();

  var file = $('#dna-content').attr('data-file');

  $.get(file, function(data, textStatus, jqXHR) {
    $('#dna-panel').show();
    dnacode.setValue(data)
  });

  function view(name) {
    if (name === 'json') {
      var dna = dnacode.getValue();
      var json = JSON.stringify(DNA.parse(dna), null, '  ');
      $('#json-content').val(json);
    } else {
      name = 'dna';
    }

    $('#editor-panel').children().hide();
    $('#' + name + '-panel').show();
    $('#editor-tabs').children().removeClass('active');
    $('#' + name + '-tab').addClass('active');
  }

  $('#json-content').on('change', _.debounce(function() {
    dnacode.setValue(DNA.stringify(JSON.parse($(this).val()), null, ' '));
  }, 1000, {
    maxWait : 2000
  }));

  view();

  return {
    view : view
  }
})();