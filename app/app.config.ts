export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      neutral: 'neutral'
    },
    button: {
      slots: {
        // Fixed px radii — Nuxt's rounded-* scale multiplies --ui-radius
        // https://sorkhab.arvancloud.ir/components/button/
        base: 'cursor-pointer rounded-[12px] font-normal gap-2'
      },
      variants: {
        size: {
          xs: {
            base: 'h-8 rounded-[8px] px-3 py-0 text-sm gap-2',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          },
          sm: {
            base: 'h-8 rounded-[8px] px-4 py-0 text-sm gap-2',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          },
          md: {
            base: 'h-10 rounded-[12px] px-4 py-0 text-base gap-2',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          }
        },
        square: {
          true: 'rounded-[8px]'
        }
      },
      compoundVariants: [
        {
          size: 'sm',
          square: true,
          class: 'size-8 rounded-[8px] p-0'
        },
        {
          size: 'md',
          square: true,
          class: 'size-10 rounded-[12px] p-0'
        },
        {
          color: 'primary',
          variant: 'solid',
          class: [
            'text-white bg-teal-500',
            'hover:bg-teal-600 active:bg-teal-800 focus-visible:bg-teal-600',
            'disabled:bg-teal-300 aria-disabled:bg-teal-300',
            'disabled:opacity-100 aria-disabled:opacity-100',
            'dark:bg-teal-600 dark:hover:bg-teal-700 dark:active:bg-teal-800 dark:focus-visible:bg-teal-700',
            'dark:text-neutral-200 dark:disabled:bg-teal-900 dark:aria-disabled:bg-teal-900'
          ].join(' ')
        },
        {
          color: 'error',
          variant: 'solid',
          class: [
            'text-white bg-[#d61e20]',
            'hover:bg-[#c11b1d] active:bg-[#ab181a] focus-visible:bg-[#c11b1d]',
            'disabled:bg-[#efa5a6] aria-disabled:bg-[#efa5a6]',
            'disabled:opacity-100 aria-disabled:opacity-100',
            'dark:bg-[#ab181a] dark:hover:bg-[#961516] dark:active:bg-[#7a1112]'
          ].join(' ')
        },
        {
          color: 'neutral',
          variant: 'solid',
          class: [
            'text-white bg-[#4c4c4c]',
            'hover:bg-[#333333] active:bg-[#191919] focus-visible:bg-[#333333]',
            'disabled:bg-[#cccccc] aria-disabled:bg-[#cccccc]',
            'disabled:opacity-100 aria-disabled:opacity-100',
            'dark:bg-[#b3b3b3] dark:text-[#191919] dark:hover:bg-[#999999] dark:active:bg-[#7f7f7f]'
          ].join(' ')
        },
        {
          color: 'primary',
          variant: 'soft',
          class: 'text-teal-600 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 dark:text-teal-400 dark:bg-teal-950 dark:hover:bg-teal-900'
        },
        {
          color: 'error',
          variant: 'soft',
          class: 'text-[#d61e20] bg-[#fdeeee] hover:bg-[#fbd4d4] active:bg-[#f8baba] dark:text-[#efa5a6] dark:bg-[#2a1010] dark:hover:bg-[#3a1515]'
        },
        {
          color: 'neutral',
          variant: 'ghost',
          class: 'text-[#4c4c4c] hover:bg-[#f0f0f0] active:bg-[#ebebeb] dark:text-[#cccccc] dark:hover:bg-[#0f0f0f] dark:active:bg-[#0a0a0a]'
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring-1 ring-inset ring-[#e6e6e6] text-[#4c4c4c] bg-white hover:bg-[#f0f0f0] active:bg-[#ebebeb] dark:ring-[#4c4c4c] dark:text-[#e6e6e6] dark:bg-[#141414] dark:hover:bg-[#0f0f0f]'
        }
      ]
    }
  }
})
