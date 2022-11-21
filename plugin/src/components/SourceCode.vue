<template>
  <codemirror v-model="sourceCode" :options="cmOptions"></codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// base style
import 'codemirror/lib/codemirror.css'

// theme css
import 'codemirror/theme/monokai.css'

// language
import 'codemirror/mode/vue/vue.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

export default {
  name: 'SourceCode',
  components: {
    codemirror,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cmOptions: {
        tabSize: 2,
        theme: 'monokai',
        styleActiveLine: true,
        lineNumbers: true,
        styleSelectedText: true,
        line: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: 'text/x-vue',
        hintOptions: {
          completeSingle: true,
        },
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: { Ctrl: 'autocomplete' },
      },
      sourceCode: this.code,
    }
  },
  watch: {
    sourceCode(newVal) {
      this.$emit('update:code', newVal)
    },
    code(newVal) {
      this.sourceCode = newVal
    },
  },
}
</script>

<style scoped>
::v-deep .CodeMirror {
  height: auto;
}
</style>
