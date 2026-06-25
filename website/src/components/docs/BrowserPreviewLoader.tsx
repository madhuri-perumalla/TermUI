'use client'

import dynamic from 'next/dynamic'

const BrowserPreviewLoaderInner = dynamic(
    () => import('./BrowserPreviewLoaderInner').then(m => m.BrowserPreviewLoaderInner),
    { ssr: false }
)

interface BrowserPreviewLoaderProps {
    slug: string
    mouse?: boolean
    className?: string
}

export function BrowserPreviewLoader(props: BrowserPreviewLoaderProps) {
    return <BrowserPreviewLoaderInner {...props} />
}
