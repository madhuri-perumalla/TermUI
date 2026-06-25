'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { RootWidget } from '@termuijs/core'

const BrowserPreview = dynamic(
    () => import('./BrowserPreview').then(m => m.BrowserPreview),
    { ssr: false }
)

interface Props {
    slug: string
    mouse?: boolean
    className?: string
}

export function BrowserPreviewLoaderInner({ slug, ...rest }: Props) {
    const [factory, setFactory] = useState<(() => RootWidget) | null>(null)

    useEffect(() => {
        import('@/data/demos').then(m => {
            const fn = m.default[slug]
            if (fn) setFactory(() => fn)
        })
    }, [slug])

    if (!factory) return null
    return <BrowserPreview factory={factory} {...rest} />
}
