<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>supervolatile.com visualisation</title>
    <link rel="stylesheet" href="c/main.css">
</head>
<body>
<div class="calendar-container">
    <div class="toggle"><label><input type="checkbox" checked>Group tags</label></div>
    <table class="calendar">
        <thead>
        <tr class="years">{{#years}}
            <th colspan="12" title="{{total}} posts">
                <div>{{name}}</div>
            </th>
            {{/years}}
        </tr>
        </thead>
        <tbody>
        <tr class="months">{{#years}}{{#months}}
            <td class="{{name}}">
                <div>{{name}}</div>
            </td>
            {{/months}}{{/years}}
        </tr>
        <tr class="posts">{{#years}}{{#months}}
            <td class="{{name}}">
                <div title="{{total}} posts">{{total}}</div>
            </td>
            {{/months}}{{/years}}
        </tr>
        </tbody>
    </table>
</div>
<table class="main">
    <tbody>
    {{#metatags}}
    <tr class="metatag {{name}}" data-metatag="{{name}}">
        <td class="expander" title="Expand">
            <div><span class="expand">▶</span><span class="collapse">▼</span></div>
        </td>
        <td class="name">
            <div>{{name}}</div>
        </td>
        <td class="count" title="Post number">{{totalPosts}}</td>
        {{#months}}
        <td>{{#hasPosts}}
            <div class="posts">
                <div class="shortcuts">{{totalPosts}}</div>
                <ul class="popup">{{#posts}}
                    <li><a href="{{url}}">{{title}}</a></li>
                    {{/posts}}
                </ul>
            </div>
            {{/hasPosts}}
        </td>
        {{/months}}
    </tr>
    {{#tags}}
    <tr class="tag {{metatag}}">
        <td class="name" title="{{metatag}}: {{name}}" colspan="2">
            <div>{{name}}</div>
        </td>
        <td class="count" title="Posts with this tag">{{total}}</td>
        {{#months}}
        <td>{{#hasPosts}}
            <div class="posts">
                <div class="shortcuts">{{total}}</div>
                <ul class="popup">{{#posts}}
                    <li><a href="{{url}}">{{title}}</a></li>
                    {{/posts}}
                </ul>
            </div>
            {{/hasPosts}}
        </td>
        {{/months}}
    </tr>
    {{/tags}}{{/metatags}}
    </tbody>
</table>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="j/infographic.js"></script>
</body>
</html>
