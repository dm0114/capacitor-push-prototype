import { useCallback, useEffect } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import { Loader2 } from 'lucide-react'

import '@blocknote/mantine/style.css'

import { useBlocks, useSaveBlocks } from '../api/queries'

interface BlockEditorProps {
  pageId: string
}

export function BlockEditor({ pageId }: BlockEditorProps) {
  const { data: initialBlocks, isLoading, error } = useBlocks(pageId)
  const saveBlocksMutation = useSaveBlocks()

  // BlockNote 에디터 인스턴스 생성
  const editor = useCreateBlockNote({
    initialContent: initialBlocks && initialBlocks.length > 0 ? initialBlocks : undefined,
  })

  // initialBlocks가 로드되면 에디터에 적용
  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0 && editor) {
      editor.replaceBlocks(editor.document, initialBlocks)
    }
  }, [initialBlocks, editor])

  // 변경 사항 저장 (debounced)
  const handleChange = useCallback(() => {
    if (!editor) return

    const blocks = editor.document
    saveBlocksMutation.mutate({ pageId, blocks })
  }, [editor, pageId, saveBlocksMutation])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 py-4">
        블록을 불러오는데 실패했습니다.
      </div>
    )
  }

  return (
    <div className="blocknote-wrapper">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="light"
        data-theming-css-variables-demo
      />
    </div>
  )
}
