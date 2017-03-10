module.exports = {
  '{{if variable}}': '<% if (variable) { %>',
  '{{if (variable)}}': '<% if (variable) { %>',
  '{{ if variable }}': '<% if (variable) { %>',
  '{{elseif variable}}': '<% } else if (variable) { %>',
  '{{elseif (variable)}}': '<% } else if (variable) { %>',
  '{{ elseif variable }}': '<% } else if (variable) { %>',
  '{{else}}': '<% } else { %>',
  '{{ else }}': '<% } else { %>',
  '{{each variable}}': '<% for (var _variable_index_ in variable) { %>',
  '{{ each variable }}': '<% for (var _variable_index_ in variable) { %>',
  '{{each variable}} {{loop_vars.variable.name}} {{end}}':
    '<% for (var _variable_index_ in variable) { %> ' +
    '<%= variable[_variable_index].name %> <% } %>'
};
