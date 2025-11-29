import { useState, useEffect } from 'react'

export function useTypewriter(titles: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
    const [titleIndex, setTitleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentTitle = titles[titleIndex]
        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (displayText.length < currentTitle.length) {
                        setDisplayText(currentTitle.slice(0, displayText.length + 1))
                    } else {
                        setTimeout(() => setIsDeleting(true), pauseDuration)
                    }
                } else {
                    if (displayText.length > 0) {
                        setDisplayText(displayText.slice(0, -1))
                    } else {
                        setIsDeleting(false)
                        setTitleIndex((prev) => (prev + 1) % titles.length)
                    }
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        )

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, titleIndex, titles, typingSpeed, deletingSpeed, pauseDuration])

    return displayText
}
