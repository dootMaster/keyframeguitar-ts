(this["webpackJsonpkey-frame-guitar-ts"]=this["webpackJsonpkey-frame-guitar-ts"]||[]).push([[0],[,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var c=n(1),r=n.n(c),a=n(8),s=n.n(a),i=n(7),o=n(2),l=(n(13),["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"]),b=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],u=["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"],j=(n(14),n(0)),d=function(e){var t=e.i,n=e.note,c=e.handleChange,r=e.cssAppend,a=e.checked,s=void 0!==a&&a;return Object(j.jsx)("input",{type:"checkbox",id:n+r,className:"checkbox-"+r+" checkbox",onChange:function(){return c(t)},checked:s})},h=function(e){var t=Object(c.useState)(l),n=Object(o.a)(t,2),r=n[0],a=n[1];Object(c.useEffect)((function(){s()}));var s=function(){"b"===e.accidental?a(l):"#"===e.accidental?a(b):a(u)},i=function(t){var n=e.form.map((function(e,n){return n===t?!e:e}));e.setForm(n)};return Object(j.jsx)("form",{className:"input-form-"+e.cssAppend,children:r.map((function(t,n){return Object(j.jsxs)("div",{className:"checkbox-bg",children:[Object(j.jsx)(d,{i:n,note:t,handleChange:i,cssAppend:e.cssAppend,checked:e.form[n]}),Object(j.jsx)("label",{htmlFor:t+e.cssAppend,className:"checkbox-label",children:t}),Object(j.jsx)("br",{})]},n)}))})},f=n(5);function O(e){return Object(j.jsx)("td",{className:e.display+" fret",onClick:function(){return e.toggleFret(e.i,e.j)},children:"b"===e.accidental?e.flat[e.dictIndex]:"#"===e.accidental?e.sharp[e.dictIndex]:e.both[e.dictIndex]})}var p=function(e){return Object(j.jsx)("tr",{className:"string",children:e.gtrString.map((function(t,n){return Object(c.createElement)(O,Object(f.a)(Object(f.a)(Object(f.a)({},e),t),{},{j:n,key:n}))}))})},m=(n(16),function(e){return Object(j.jsxs)("table",{className:"fretboard",children:[Object(j.jsx)("tbody",{children:e.fretboard.map((function(t,n){return Object(j.jsx)(p,{gtrString:t,i:n,toggleFret:e.toggleFret,accidental:e.accidental,flat:e.flat,sharp:e.sharp,both:e.both},n)}))}),Object(j.jsx)("tfoot",{children:Object(j.jsx)("tr",{className:"fret-dots",children:[0,0,0,1,0,1,0,1,0,1,0,0,0].map((function(e,t){return e?Object(j.jsx)("td",{children:"\u2022"}):12===t?Object(j.jsx)("td",{children:"\u2022\u2022"}):Object(j.jsx)("td",{})}))})})]})});function x(e){return e.map((function(e){return function(e){for(var t=[],n=e;t.length<13;)n<12&&t.push({display:"neutral",dictIndex:n}),n>=12&&(n=0,t.push({display:"neutral",dictIndex:n})),n+=1;return t}(e)}))}var g={0:"C",1:"C#",2:"D",3:"D#",4:"E",5:"F",6:"F#",7:"G",8:"G#",9:"A",10:"A#",11:"B"},v={0:"C",1:"Db",2:"D",3:"Eb",4:"E",5:"F",6:"Gb",7:"G",8:"Ab",9:"A",10:"Bb",11:"B"},y={0:"C",1:"C#/Db",2:"D",3:"D#/Eb",4:"E",5:"F",6:"F#/Gb",7:"G",8:"G#/Ab",9:"A",10:"A#/Bb",11:"B"},A=function(e,t,n){e.forEach((function(e,c){e.forEach((function(e,c){var r=e.dictIndex;t[r]&&n[r]?e.display="common":t[r]&&!n[r]?e.display="current":!t[r]&&n[r]?e.display="target":e.display="neutral"}))}))},F=(n(17),function(e){var t=[4,11,7,2,9,4],n=function(n){var c=function(e){switch(parseInt(e)){case 4:return[7,2,9,4];case 5:return[7,2,9,4,11];case 6:return[4,11,7,2,9,4];case 7:return[4,11,7,2,9,4,11];case 8:return[4,11,7,2,9,4,11,6];case 9:return[4,11,7,2,9,4,11,6,1]}}(n.currentTarget.value)||t;e.setTuning(c);var r=x(c);A(r,e.currentForm,e.targetForm),e.setFretboard(r)};return Object(j.jsxs)("div",{className:"string-qty-container",children:[Object(j.jsx)("label",{htmlFor:"String Amount",className:"string-qty-label",children:"#"}),Object(j.jsxs)("select",{name:"String Amount",className:"string-qty-select",onChange:function(e){return n(e)},defaultValue:6,children:[Object(j.jsx)("option",{value:4,children:4}),Object(j.jsx)("option",{value:5,children:5}),Object(j.jsx)("option",{value:6,children:6}),Object(j.jsx)("option",{value:7,children:7}),Object(j.jsx)("option",{value:8,children:8}),Object(j.jsx)("option",{value:9,children:9})]})]})}),k=(n(18),function(e){var t=e.handleClose,n=e.show,c=e.tuning,r=n?"tuning-modal display-block":"tuning-modal display-none";return Object(j.jsx)("div",{className:r,children:Object(j.jsxs)("section",{className:"tuning-modal-main",children:[c,Object(j.jsx)("button",{onClick:function(){return t()},children:"X"})]})})});var C=function(){var e=Object(c.useState)([4,11,7,2,9,4]),t=Object(o.a)(e,2),n=t[0],r=t[1],a=Object(c.useState)(x([4,11,7,2,9,4])),s=Object(o.a)(a,2),l=s[0],b=s[1],u=Object(c.useState)("b"),d=Object(o.a)(u,2),f=d[0],O=d[1],p=Object(c.useState)(new Array(12).fill(!1)),C=Object(o.a)(p,2),N=C[0],E=C[1],G=Object(c.useState)(new Array(12).fill(!1)),D=Object(o.a)(G,2),S=D[0],w=D[1],B=Object(c.useState)(!1),I=Object(o.a)(B,2),T=I[0],q=I[1];Object(c.useEffect)((function(){J()}),[N,S]);var J=function(){var e=Object(i.a)(l);A(e,N,S),b(e)},K=function(){q(!T)};return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsx)("h1",{children:"Key Frame Guitar"}),Object(j.jsx)("h5",{children:"I built this app to help students of the guitar focus on navigating a specific chord change. I hope that you find it useful. - Leslie"}),Object(j.jsx)(m,{fretboard:l,accidental:f,flat:v,sharp:g,both:y,toggleFret:function(e,t){var n=Object(i.a)(l);!function(e,t,n){switch(e[t][n].display){case"neutral":e[t][n].display="current";break;case"current":e[t][n].display="target";break;case"target":e[t][n].display="common";break;case"common":e[t][n].display="neutral"}}(n,e,t),b(n)}}),Object(j.jsxs)("div",{className:"forms-container",children:[Object(j.jsx)(h,{accidental:f,form:N,setForm:E,cssAppend:"current"}),Object(j.jsx)(h,{accidental:f,form:S,setForm:w,cssAppend:"target"}),Object(j.jsxs)("div",{className:"tools-container",children:[Object(j.jsx)(F,{accidental:f,setFretboard:b,fretboard:l,currentForm:N,targetForm:S,setTuning:r}),Object(j.jsx)("br",{}),Object(j.jsx)("button",{className:"acc-button button",onClick:function(){switch(f){case"b":O("#");break;case"#":O("*");break;case"*":O("b")}},children:"\u266d \u266f \u2736"}),Object(j.jsx)("br",{}),Object(j.jsx)("button",{className:"show-tuning-button",onClick:K,children:"\u2442"}),Object(j.jsx)("br",{}),Object(j.jsx)("button",{onClick:function(){var e=new Array(12).fill(!1);E(e),w(e),b(x(n))},className:"reset-button button",children:"RESET"})]})]}),Object(j.jsx)(k,{handleClose:K,show:T,tuning:n})]})};s.a.render(Object(j.jsx)(r.a.StrictMode,{children:Object(j.jsx)(C,{})}),document.getElementById("root"))}],[[19,1,2]]]);
//# sourceMappingURL=main.64a8ee01.chunk.js.map