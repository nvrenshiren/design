/** Optional Tailwind base. Apply root to <html> and body to <body> or an app root.
 * Colors and type follow the generated Ant Design token values, not a second palette.
 */
export const cohesionBaseClasses = Object.freeze({
  orb: 'cb:inline-grid cb:size-(--orb-size) cb:place-items-center',
  orbCanvas: 'cb:block cb:size-(--orb-size) cb:in-[[data-orb-status=error]]:hidden',
  orbFallback: 'cb:text-xs cb:wrap-anywhere',
  root: 'cb:scheme-light cb:data-[theme=dark]:scheme-dark',
  body: 'cb:m-0 cb:bg-(--ant-token-color-bg-container) cb:text-(--ant-token-color-text) cb:[font-family:var(--ant-token-font-family)] cb:text-(length:--ant-token-font-size) cb:leading-(--ant-token-line-height) cb:[&_*]:box-border cb:[&_*::before]:box-border cb:[&_*::after]:box-border cb:[&_button]:[font:inherit] cb:[&_input]:[font:inherit] cb:[&_select]:[font:inherit] cb:[&_textarea]:[font:inherit] cb:[&_input]:caret-(--ant-token-color-primary) cb:[&_textarea]:caret-(--ant-token-color-primary) cb:selection:bg-(--ant-token-color-primary-bg-hover) cb:selection:text-(--ant-token-color-text) cb:[&_a]:text-(--ant-token-color-link) cb:[&_a]:underline-offset-[3px] cb:[&_a:hover]:text-(--ant-token-color-link-hover) cb:[&_:focus-visible]:outline-2 cb:[&_:focus-visible]:outline-(--ant-token-color-primary) cb:[&_:focus-visible]:outline-offset-[3px] cb:[&_code]:[font-family:var(--ant-token-font-family-code)] cb:[&_pre]:[font-family:var(--ant-token-font-family-code)] cb:[&_kbd]:[font-family:var(--ant-token-font-family-code)]',
});
