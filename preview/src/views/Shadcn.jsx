import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  FileText,
  FolderOpen,
  Info,
  Mail,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";
import { ShadcnScope } from "../../shadcn/scope";
import { TransitionsGallery } from "../../shadcn/transitions/gallery";
import { Button } from "../../shadcn/components/ui/button";
import { Badge } from "../../shadcn/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn/components/ui/tabs";
import { Input } from "../../shadcn/components/ui/input";
import { Textarea } from "../../shadcn/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../shadcn/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { Switch } from "../../shadcn/components/ui/switch";
import { Checkbox } from "../../shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../shadcn/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../shadcn/components/ui/alert-dialog";
import { Skeleton } from "../../shadcn/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../shadcn/components/ui/empty";
import { Separator } from "../../shadcn/components/ui/separator";
import { Spinner } from "../../shadcn/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/components/ui/table";
import preset from "../../../theme/shadcn-tokens.json";

const TOKEN_GROUPS = [
  {
    id: "surface",
    name: "表面与文字",
    roles: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "muted",
      "muted-foreground",
    ],
  },
  {
    id: "action",
    name: "动作与状态",
    roles: [
      "primary",
      "primary-foreground",
      "primary-hover",
      "primary-active",
      "link",
      "link-hover",
      "link-active",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "destructive-solid",
      "destructive-hover",
      "destructive-active",
      "border",
      "input",
      "ring",
    ],
  },
  { id: "chart", name: "图表", prefix: "chart-" },
  { id: "sidebar", name: "侧栏", prefix: "sidebar" },
  { id: "foundation", name: "形状与其他基础值", remaining: true },
];

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
function readTab() {
  if (typeof location === "undefined") return "tokens";
  const value = new URLSearchParams(location.hash.split("?")[1] || "").get(
    "tab",
  );
  return ["tokens", "components", "patterns", "transitions"].includes(value)
    ? value
    : "tokens";
}

function Feedback({ notice }) {
  if (!notice) return null;
  return (
    <div aria-live="polite" aria-atomic="true" className="sc-feedback sc:[scroll-margin-top:90px]">
      <Alert variant={notice.error ? "destructive" : "default"}>
        {notice.error ? <Info /> : <CheckCheck />}
        <AlertTitle>{notice.title}</AlertTitle>
        {notice.description && (
          <AlertDescription>{notice.description}</AlertDescription>
        )}
      </Alert>
    </div>
  );
}

function useDemoFeedback() {
  const [notice, setNotice] = useState(null);
  const announce = (title, description, error = false) =>
    setNotice({ title, description, error });
  return { notice, announce };
}

async function copyText(value, announce, title) {
  try {
    await navigator.clipboard.writeText(value);
    announce(title || "已复制到剪贴板");
  } catch {
    announce(
      "浏览器未允许复制",
      "请选中需要的 token 文本，使用系统复制快捷键。",
      true,
    );
  }
}

function TokenSample({ mode, announce }) {
  const values = preset[mode];
  const copyVariables = () =>
    copyText(
      Object.entries(values)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n"),
      announce,
      `已复制${mode === "dark" ? "深" : "浅"}色预设变量`,
    );
  return (
    <ShadcnScope mode={mode} stopped>
      <Card className="sc-theme-sample sc:h-full sc:[&_[data-slot='card-header']]:min-h-38 sc:[&_[data-slot='card-footer']]:mt-auto sc:at-most-767:[&_[data-slot='card-header']]:min-h-0 sc:at-most-360:[&_[data-slot='card-footer']_>_[data-slot='button']]:w-full" data-shadcn-theme-sample={mode}>
        <CardHeader>
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-spread sc:justify-between">
            <Badge variant="secondary">
              {mode === "dark" ? "Dark" : "Light"}
            </Badge>
            <span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">COHESION · New York</span>
          </div>
          <CardTitle>同一组语义，完整的浅深预设</CardTitle>
          <CardDescription>
            Card、Input 和 Button 使用各自配对的前景与背景 token。
          </CardDescription>
        </CardHeader>
        <CardContent className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`sc-preset-${mode}`}>空间名称</FieldLabel>
              <Input
                id={`sc-preset-${mode}`}
                defaultValue="产品设计空间"
                aria-label={`${mode === "dark" ? "深" : "浅"}色预设空间名称`}
              />
            </Field>
          </FieldGroup>
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0">
            <Badge>进行中</Badge>
            <Badge variant="outline">演示数据</Badge>
          </div>
        </CardContent>
        <CardFooter className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap">
          <Button onClick={copyVariables}>
            <Copy data-icon="inline-start" />
            复制{mode === "dark" ? "深" : "浅"}色变量
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://ui.shadcn.com/docs/theming"
              target="_blank"
              rel="noreferrer"
            >
              官方预设
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </ShadcnScope>
  );
}

function TokenView() {
  const [query, setQuery] = useState("");
  const { notice, announce } = useDemoFeedback();
  const tokens = Object.keys(preset.light);
  const assigned = new Set();
  const groups = TOKEN_GROUPS.map((group) => {
    const roles = tokens.filter((role) =>
      group.remaining
        ? !assigned.has(role)
        : group.roles?.includes(role) ||
          (group.prefix && role.startsWith(group.prefix)),
    );
    roles.forEach((role) => assigned.add(role));
    return {
      ...group,
      roles: roles.filter((role) =>
        `${role} ${group.name}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    };
  }).filter((group) => group.roles.length);
  const count = groups.reduce((sum, group) => sum + group.roles.length, 0);
  return (
    <div className="sc-panel-stack sc:flex sc:flex-col sc:gap-8 sc:pt-6 sc:min-w-0 sc:at-most-767:gap-[26px] sc:at-most-767:pt-[22px]" data-shadcn-tokens>
      <div className="sc-section-intro">
        <h2>预设已经备齐，从语义开始使用</h2>
        <p>
          以官方 New York / Neutral 为基础，主操作、选中与焦点使用逐科品牌绿色。
          浅深主题由同一份品牌配置生成，组件保持 shadcn/ui 的比例与交互。
        </p>
      </div>
      <div className="sc-theme-grid sc:grid sc:[grid-template-columns:repeat(2,_minmax(0,_1fr))] sc:gap-6 sc:items-start sc:min-w-0 sc:[&_>_*]:min-w-0 sc:at-most-1100:gap-[18px] sc:at-most-767:[grid-template-columns:minmax(0,_1fr)] sc:at-most-767:gap-5">
        <TokenSample mode="light" announce={announce} />
        <TokenSample mode="dark" announce={announce} />
      </div>
      <Feedback notice={notice} />
      <Alert>
        <Info />
        <AlertTitle>共享品牌，保留各自的组件基础</AlertTitle>
        <AlertDescription>
          shadcn/ui 通过 CSS 语义变量与组件源码组合；品牌角色与 Ant Design 共用配置，
          不将其组件样式互相覆盖。Ant Design 通过
          Seed、Map、Alias token
          和主题算法派生。本页跟随全局浅深主题；紧凑模式是 Ant Design
          的算法能力，本页保留 shadcn/ui 默认尺寸。
        </AlertDescription>
      </Alert>
      <section className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0" aria-labelledby="sc-token-title">
        <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-spread sc:justify-between sc-wrap sc:flex-wrap">
          <div>
            <h2 id="sc-token-title">完整主题变量</h2>
            <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">
              {tokens.length} 个语义变量 ×
              浅深两套预设。表格展示源值，色块展示浏览器实际颜色。
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="./theme/shadcn-tokens.json" download>
              <ArrowDownToLine data-icon="inline-start" />
              下载完整 JSON
            </a>
          </Button>
        </div>
        <FieldGroup className="sc-token-search sc:max-w-[440px]">
          <Field>
            <FieldLabel htmlFor="sc-token-search sc:max-w-[440px]">搜索 token</FieldLabel>
            <Input
              id="sc-token-search sc:max-w-[440px]"
              placeholder="例如 primary、sidebar、表面"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <FieldDescription>
              当前显示 {count} / {tokens.length} 个变量。
            </FieldDescription>
          </Field>
        </FieldGroup>
        {groups.length ? (
          groups.map((group) => (
            <section
              key={group.id}
              className="sc-token-group sc:min-w-0 sc:[&_[data-slot='table']]:min-w-[660px] sc:[&_[data-slot='table-head']]:h-[42px] sc:[&_[data-slot='table-cell']]:pt-[10px] sc:[&_[data-slot='table-cell']]:pb-[10px]"
              aria-labelledby={`sc-group-${group.id}`}
            >
              <h3 id={`sc-group-${group.id}`}>{group.name}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSS 变量</TableHead>
                    <TableHead>浅色值</TableHead>
                    <TableHead>深色值</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.roles.map((role) => (
                    <TableRow key={role}>
                      <TableCell>
                        <code>--{role}</code>
                      </TableCell>
                      {["light", "dark"].map((mode) => (
                        <TableCell key={mode}>
                          <div className="sc-token-value sc:flex sc:items-center sc:gap-2 sc:[&_code]:[font-size:12px] sc:[&_code]:whitespace-nowrap sc:[&_[data-slot='button']]:ml-auto sc:[&_[data-slot='button']]:shrink-0">
                            {role !== "radius" && (
                              <i
                                aria-hidden="true"
                                className="sc-token-swatch sc:bg-[var(--swatch-value)] sc:block sc:size-[18px] sc:[flex:0_0_18px] sc:rounded-[4px] sc:border sc:border-border"
                                style={{ "--swatch-value": preset[mode][role] }}
                              />
                            )}
                            <code>{preset[mode][role]}</code>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`复制 --${role} 的${mode === "dark" ? "深" : "浅"}色值`}
                              onClick={() =>
                                copyText(
                                  preset[mode][role],
                                  announce,
                                  `已复制 --${role}`,
                                )
                              }
                            >
                              <Copy />
                            </Button>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>没有匹配的 token</EmptyTitle>
              <EmptyDescription>
                尝试输入变量名，例如 background、primary 或 radius。
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => setQuery("")}>
                清空搜索
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </section>
      <section className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0" aria-labelledby="sc-source-title">
        <h2 id="sc-source-title">配置入口与来源</h2>
        <div className="sc-source-grid sc:grid sc:[grid-template-columns:repeat(2,_minmax(0,_1fr))] sc:gap-6 sc:items-start sc:min-w-0 sc:[&_pre]:leading-[1.75] sc:[&_[data-slot='card']]:h-full sc:[&_[data-slot='card-footer']]:mt-auto sc:at-most-1100:gap-[18px] sc:at-most-767:[grid-template-columns:minmax(0,_1fr)] sc:at-most-767:gap-5">
          <Card>
            <CardHeader>
              <CardTitle>官方基础与品牌主题</CardTitle>
              <CardDescription>
                通过官方 CLI 添加源码，沿用 variants 与 Radix 交互；
                品牌状态以实体色保证清晰，避免透明度混色后降低对比。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre>{`// components.json\n{\n  "style": "new-york",\n  "tailwind": {\n    "baseColor": "neutral",\n    "cssVariables": true,\n    "prefix": "sc"\n  }\n}`}</pre>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild>
                <a
                    href="https://ui.shadcn.com/docs/components/radix/button"
                  target="_blank"
                  rel="noreferrer"
                >
                  查看 shadcn/ui 组件
                  <ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>可追溯的接入</CardTitle>
              <CardDescription>
                页面主题独立作用于 shadcn scope；弹窗、菜单和 Select
                浮层继承同一作用域。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="sc-source-list sc:m-0 sc:p-0 sc:list-none sc:flex sc:flex-col sc:gap-[18px] sc:[&_li]:flex sc:[&_li]:flex-col sc:[&_li]:gap-1 sc:[&_span]:text-muted-foreground sc:[&_span]:[font-size:13px]">
                <li>
                  <code>components.json</code>
                  <span>官方 CLI 配置</span>
                </li>
                <li>
                  <code>theme/shadcn-tokens.json</code>
                  <span>品牌主题生成的完整浅深 token</span>
                </li>
                <li>
                  <code>theme/create-shadcn-theme.mjs</code>
                  <span>官方基线与共享品牌角色的映射入口</span>
                </li>
                <li>
                  <code>preview/shadcn/components/ui/</code>
                  <span>可编辑的真实组件源码</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href="./theme/shadcn-tokens.json" download>
                  获取预设 JSON
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

function InviteDialog({ announce }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const input = useRef();
  const submit = (event) => {
    event.preventDefault();
    if (!emailIsValid(email)) {
      setError(true);
      input.current?.focus();
      return;
    }
    setOpen(false);
    announce(
      "演示邀请已准备",
      `成员 ${email.trim()} 已加入本次本地演示，没有发送真实邮件。`,
    );
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setError(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail data-icon="inline-start" />
          邀请成员
        </Button>
      </DialogTrigger>
      <DialogContent data-shadcn-invite-dialog>
        <DialogHeader>
          <DialogTitle>邀请演示成员</DialogTitle>
          <DialogDescription>
            填写成员邮箱，体验 Dialog 的焦点管理与表单校验。不会发送真实邮件。
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={submit}>
          <FieldGroup>
            <Field data-invalid={error || undefined}>
              <FieldLabel htmlFor="sc-invite-email">成员邮箱</FieldLabel>
              <Input
                ref={input}
                id="sc-invite-email"
                type="email"
                autoComplete="off"
                placeholder="member@example.com"
                value={email}
                aria-invalid={error || undefined}
                aria-describedby={error ? "sc-invite-error" : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(false);
                }}
              />
              {error && (
                <FieldError id="sc-invite-error">
                  请填写完整的成员邮箱
                </FieldError>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="sc-dialog-actions sc:mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                取消
              </Button>
            </DialogClose>
            <Button type="submit">发送演示邀请</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InputExample({ announce }) {
  const [form, setForm] = useState({
    name: "产品设计空间",
    email: "team@example.com",
    type: "tool",
  });
  const [errors, setErrors] = useState({});
  const nameRef = useRef();
  const emailRef = useRef();
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 24)
      next.name = "空间名称需为 2–24 个字符";
    if (!emailIsValid(form.email)) next.email = "请填写完整的通知邮箱";
    setErrors(next);
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else
      announce(
        "演示空间已保存",
        `${form.name.trim()} · ${form.email.trim()}。此操作仅保存当前演示状态。`,
      );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>输入、选择与校验</CardTitle>
        <CardDescription>
          标签、说明和错误信息紧邻控件。提交后，焦点回到第一个需要修正的字段。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={submit} id="sc-space-form">
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor="sc-space-name">空间名称</FieldLabel>
              <Input
                ref={nameRef}
                id="sc-space-name"
                maxLength={24}
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name) || undefined}
                aria-describedby={
                  errors.name ? "sc-space-name-error" : "sc-space-name-help"
                }
              />
              <FieldDescription id="sc-space-name-help">
                2–24 个字符，创建后仍可修改。
              </FieldDescription>
              {errors.name && (
                <FieldError id="sc-space-name-error">{errors.name}</FieldError>
              )}
            </Field>
            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="sc-space-email">通知邮箱</FieldLabel>
              <Input
                ref={emailRef}
                id="sc-space-email"
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={
                  errors.email ? "sc-space-email-error" : undefined
                }
              />
              {errors.email && (
                <FieldError id="sc-space-email-error">
                  {errors.email}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="sc-space-type">业务类型</FieldLabel>
              <Select
                value={form.type}
                onValueChange={(value) => update("type", value)}
              >
                <SelectTrigger id="sc-space-type">
                  <SelectValue placeholder="请选择业务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>多业务通用</SelectLabel>
                    <SelectItem value="content">内容与媒体</SelectItem>
                    <SelectItem value="tool">效率工具</SelectItem>
                    <SelectItem value="service">生活服务</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor="sc-space-id">空间标识</FieldLabel>
              <Input id="sc-space-id" value="cohesion-demo" disabled />
              <FieldDescription>禁用态说明当前不可编辑。</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="sc-space-form" type="submit">
          <Check data-icon="inline-start" />
          验证并保存
        </Button>
      </CardFooter>
    </Card>
  );
}

function ComponentView() {
  const { notice, announce } = useDemoFeedback();
  const [saving, setSaving] = useState(false);
  const [notify, setNotify] = useState(true);
  const [channels, setChannels] = useState(["web"]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const save = () => {
    setSaving(true);
    timers.current.push(
      setTimeout(() => {
        setSaving(false);
        announce("演示草稿已保存");
      }, 800),
    );
  };
  const load = () => {
    setLoading(true);
    timers.current.push(
      setTimeout(() => {
        setDocuments([
          {
            id: 1,
            title: "产品设计手册",
            description: "已载入 1 份本地演示文档",
          },
        ]);
        setLoading(false);
        announce("演示文档已载入");
      }, 900),
    );
  };
  return (
    <div className="sc-panel-stack sc:flex sc:flex-col sc:gap-8 sc:pt-6 sc:min-w-0 sc:at-most-767:gap-[26px] sc:at-most-767:pt-[22px]" data-shadcn-components>
      <div className="sc-section-intro">
        <h2>组件有真实的状态和行为</h2>
        <p>
          使用官方源码里的 Button variants、Radix 浮层与 Field
          组合。所有示例均可操作，反馈会出现在当前区域。
        </p>
      </div>
      <Feedback notice={notice} />
      <Card>
        <CardHeader>
          <CardTitle>操作层级</CardTitle>
          <CardDescription>
            主要、次要、轻量和危险操作使用内置 variant；加载态由 Spinner 与
            disabled 组合。
          </CardDescription>
        </CardHeader>
        <CardContent className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0">
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap">
            <Button disabled={saving} onClick={save}>
              {saving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Check data-icon="inline-start" />
              )}
              {saving ? "保存中…" : "保存演示草稿"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => announce("已切换为演示副本")}
            >
              次要操作
            </Button>
            <Button
              variant="outline"
              onClick={() => announce("演示内容已预览")}
            >
              查看预览
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                announce("演示详情已展开", "轻量操作适用于辅助功能。")
              }
            >
              轻量操作
            </Button>
            <Button variant="link" asChild>
              <a
                href="https://ui.shadcn.com/docs/components/radix/button"
                target="_blank"
                rel="noreferrer"
              >
                按钮规范
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
            <Button disabled>权限不足</Button>
          </div>
          <Separator />
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap">
            <InviteDialog announce={announce} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="更多空间操作">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>演示空间</DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={() =>
                      copyText("产品设计空间", announce, "已复制空间名称")
                    }
                  >
                    <Copy />
                    复制空间名称
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      const blob = new Blob(
                        [
                          JSON.stringify(
                            { name: "产品设计空间", demo: true },
                            null,
                            2,
                          ),
                        ],
                        { type: "application/json" },
                      );
                      const url = URL.createObjectURL(blob);
                      const anchor = document.createElement("a");
                      anchor.href = url;
                      anchor.download = "cohesion-shadcn-demo.json";
                      anchor.click();
                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                      announce("演示配置已导出");
                    }}
                  >
                    <ArrowDownToLine />
                    导出演示配置
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled>
                    迁移空间 · 仅演示
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 data-icon="inline-start" />
                  删除演示草稿
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>删除这份演示草稿？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此处演示高风险动作的确认流程，不会删除真实文件。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>保留草稿</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => announce("演示草稿已删除")}
                  >
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
        <CardFooter>
          <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">
            菜单支持方向键；Dialog 支持 Escape 关闭，并把焦点返回触发按钮。
          </p>
        </CardFooter>
      </Card>
      <div className="sc-example-grid sc:grid sc:[grid-template-columns:repeat(2,_minmax(0,_1fr))] sc:gap-6 sc:items-start sc:min-w-0 sc:at-most-1100:gap-[18px] sc:at-most-767:[grid-template-columns:minmax(0,_1fr)] sc:at-most-767:gap-5">
        <InputExample announce={announce} />
        <Card>
          <CardHeader>
            <CardTitle>偏好与多选</CardTitle>
            <CardDescription>
              Switch 表示开关；Checkbox 用于可多选的提交选项。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="sc-demo-notify">接收产品更新</FieldLabel>
                  <FieldDescription>
                    {notify
                      ? "当前已开启，可随时关闭。"
                      : "当前已关闭，不接收演示更新。"}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="sc-demo-notify"
                  checked={notify}
                  onCheckedChange={setNotify}
                />
              </Field>
              <Separator />
              <FieldSet>
                <FieldLegend variant="label">发布渠道</FieldLegend>
                <FieldDescription>
                  可多选，当前选择 {channels.length} 项。
                </FieldDescription>
                <FieldGroup>
                  {[
                    { value: "web", label: "Web 工作台" },
                    { value: "mobile", label: "移动端服务" },
                    { value: "content", label: "内容空间" },
                  ].map((option) => (
                    <Field orientation="horizontal" key={option.value}>
                      <Checkbox
                        id={`sc-channel-${option.value}`}
                        checked={channels.includes(option.value)}
                        onCheckedChange={(checked) =>
                          setChannels((current) =>
                            checked === true
                              ? [...current, option.value]
                              : current.filter(
                                  (value) => value !== option.value,
                                ),
                          )
                        }
                      />
                      <FieldLabel htmlFor={`sc-channel-${option.value}`}>
                        {option.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() =>
                announce(
                  "演示选项已应用",
                  `产品更新${notify ? "开启" : "关闭"} · ${channels.length} 个发布渠道`,
                )
              }
            >
              应用演示选项
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>加载与空状态</CardTitle>
          <CardDescription>
            先给出当前状态，再给用户明确的下一步。载入操作使用本地演示数据。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div
              className="sc-skeleton-stack sc:flex sc:flex-col sc:gap-[14px] sc:p-[12px_0]"
              aria-label="正在载入演示文档"
              aria-busy="true"
            >
              <Skeleton className="sc-skeleton-title sc:w-[42%] sc:h-[22px]" />
              <Skeleton className="sc-skeleton-line sc:w-[90%] sc:h-4" />
              <Skeleton className="sc-skeleton-line-short sc:w-[68%] sc:h-4" />
            </div>
          ) : documents.length ? (
            <div className="sc-document-list sc:flex sc:flex-col sc:gap-4 sc:[&_>_.sc-inline_>_[data-slot='badge']]:ml-auto sc:[&_svg]:size-[22px]">
              {documents.map((item) => (
                <div key={item.id} className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0">
                  <FileText aria-hidden="true" />
                  <div>
                    <strong>{item.title}</strong>
                    <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">{item.description}</p>
                  </div>
                  <Badge variant="secondary">演示</Badge>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpen />
                </EmptyMedia>
                <EmptyTitle>还没有演示文档</EmptyTitle>
                <EmptyDescription>
                  载入一份示例文档，体验从空状态到加载完成的完整反馈。
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={load}>
                  <Plus data-icon="inline-start" />
                  载入演示文档
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
        <CardFooter>
          {documents.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setDocuments([]);
                announce("已清空演示文档");
              }}
            >
              <RotateCcw data-icon="inline-start" />
              重置为空状态
            </Button>
          )}
          {loading && (
            <span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]" role="status">
              正在载入本地示例…
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

const DEFAULT_PREFERENCES = {
  name: "林晓",
  email: "design@example.com",
  direction: "tool",
  bio: "让内容、工具与服务拥有一致而清晰的体验。",
  weekly: true,
  channels: ["product", "service"],
};
const PREFERENCES_KEY = "cohesion-shadcn-preferences-demo";
function readPreferences() {
  try {
    const value = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
    if (
      value &&
      typeof value.name === "string" &&
      typeof value.email === "string" &&
      ["content", "tool", "service"].includes(value.direction) &&
      typeof value.bio === "string" &&
      typeof value.weekly === "boolean" &&
      Array.isArray(value.channels)
    )
      return {
        ...value,
        channels: value.channels.filter((channel) =>
          ["product", "service", "research"].includes(channel),
        ),
      };
  } catch {
    /* An unreadable local demo record falls back to the documented defaults. */
  }
  return {
    ...DEFAULT_PREFERENCES,
    channels: [...DEFAULT_PREFERENCES.channels],
  };
}

function PatternView() {
  const [initial] = useState(readPreferences);
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notice, announce } = useDemoFeedback();
  const nameRef = useRef();
  const emailRef = useRef();
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 24)
      next.name = "显示名称需为 2–24 个字符";
    if (!emailIsValid(form.email)) next.email = "请填写完整的联系邮箱";
    setErrors(next);
    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    const snapshot = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      bio: form.bio.trim(),
    };
    setSaving(true);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(snapshot));
        setForm(snapshot);
        setSaved(snapshot);
        announce(
          "演示偏好已保存到当前浏览器",
          "重新进入本页时会恢复这些演示设置，不涉及真实账户。",
        );
      } catch {
        announce(
          "当前浏览器无法保存演示偏好",
          "设置仍保留在页面中，请检查浏览器的本地存储权限后重试。",
          true,
        );
      }
      setSaving(false);
    }, 800);
  };
  const reset = () => {
    setForm({
      ...DEFAULT_PREFERENCES,
      channels: [...DEFAULT_PREFERENCES.channels],
    });
    setErrors({});
    announce(
      "已还原演示内容",
      "点击“保存偏好”后，默认设置才会写入当前浏览器。",
    );
  };
  const directionLabels = {
    content: "内容与媒体",
    tool: "效率工具",
    service: "生活服务",
  };
  return (
    <div className="sc-panel-stack sc:flex sc:flex-col sc:gap-8 sc:pt-6 sc:min-w-0 sc:at-most-767:gap-[26px] sc:at-most-767:pt-[22px]" data-shadcn-patterns>
      <div className="sc-section-intro">
        <h2>把组件组合成完整任务</h2>
        <p>
          一个可编辑、可校验、可保存并可恢复的资料与偏好设置。所有内容都是本地演示数据。
        </p>
      </div>
      <Feedback notice={notice} />
      <div className="sc-workspace-grid sc:grid sc:[grid-template-columns:minmax(0,_1.45fr)_minmax(0,_1fr)] sc:gap-6 sc:items-start sc:[&_aside]:min-w-0 sc:[&_[data-slot='card-content']_.sc-inline_>_div]:min-w-0 sc:[&_[data-slot='card-content']_.sc-inline_>_div]:[overflow-wrap:anywhere] sc:at-most-1100:[grid-template-columns:minmax(0,_1.4fr)_minmax(0,_1fr)] sc:at-most-1100:gap-[18px] sc:at-most-767:[grid-template-columns:minmax(0,_1fr)] sc:at-most-767:gap-5 sc:at-most-767:[&_[data-slot='card-footer']_>_.sc-inline]:w-full sc:at-most-767:[&_[data-slot='card-footer']_>_.sc-inline]:justify-end">
        <Card>
          <CardHeader>
            <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-spread sc:justify-between">
              <Badge variant="secondary">偏好设置</Badge>
              <Badge variant="outline">本地演示</Badge>
            </div>
            <CardTitle>资料与通知</CardTitle>
            <CardDescription>
              字段反馈遵循相同语义，提交时提供清楚的进行状态与结果。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="sc-preferences-form" noValidate onSubmit={submit}>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.name) || undefined}>
                  <FieldLabel htmlFor="sc-profile-name">显示名称</FieldLabel>
                  <Input
                    ref={nameRef}
                    id="sc-profile-name"
                    maxLength={24}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    aria-invalid={Boolean(errors.name) || undefined}
                    aria-describedby={
                      errors.name
                        ? "sc-profile-name-error"
                        : "sc-profile-name-help"
                    }
                    disabled={saving}
                  />
                  <FieldDescription id="sc-profile-name-help">
                    供团队识别，2–24 个字符。
                  </FieldDescription>
                  {errors.name && (
                    <FieldError id="sc-profile-name-error">
                      {errors.name}
                    </FieldError>
                  )}
                </Field>
                <Field data-invalid={Boolean(errors.email) || undefined}>
                  <FieldLabel htmlFor="sc-profile-email">联系邮箱</FieldLabel>
                  <Input
                    ref={emailRef}
                    id="sc-profile-email"
                    type="email"
                    autoComplete="off"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    aria-invalid={Boolean(errors.email) || undefined}
                    aria-describedby={
                      errors.email ? "sc-profile-email-error" : undefined
                    }
                    disabled={saving}
                  />
                  {errors.email && (
                    <FieldError id="sc-profile-email-error">
                      {errors.email}
                    </FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="sc-profile-direction">
                    业务方向
                  </FieldLabel>
                  <Select
                    value={form.direction}
                    onValueChange={(value) => update("direction", value)}
                    disabled={saving}
                  >
                    <SelectTrigger id="sc-profile-direction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>主要业务</SelectLabel>
                        <SelectItem value="content">内容与媒体</SelectItem>
                        <SelectItem value="tool">效率工具</SelectItem>
                        <SelectItem value="service">生活服务</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="sc-profile-bio">个人简介</FieldLabel>
                  <Textarea
                    id="sc-profile-bio"
                    maxLength={160}
                    value={form.bio}
                    onChange={(event) => update("bio", event.target.value)}
                    aria-describedby="sc-profile-bio-help"
                    disabled={saving}
                  />
                  <FieldDescription id="sc-profile-bio-help">
                    {form.bio.length} / 160 字符
                  </FieldDescription>
                </Field>
                <Separator />
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="sc-profile-weekly">
                      每周工作摘要
                    </FieldLabel>
                    <FieldDescription>
                      每周汇总已订阅业务的更新。
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="sc-profile-weekly"
                    checked={form.weekly}
                    onCheckedChange={(value) => update("weekly", value)}
                    disabled={saving}
                  />
                </Field>
                <FieldSet>
                  <FieldLegend variant="label">订阅内容</FieldLegend>
                  <FieldDescription>
                    选择希望在摘要中看到的信息。
                  </FieldDescription>
                  <FieldGroup>
                    {[
                      { value: "product", label: "产品与设计更新" },
                      { value: "service", label: "服务进度通知" },
                      { value: "research", label: "用户研究招募" },
                    ].map((option) => (
                      <Field key={option.value} orientation="horizontal">
                        <Checkbox
                          id={`sc-profile-${option.value}`}
                          checked={form.channels.includes(option.value)}
                          disabled={saving}
                          onCheckedChange={(value) =>
                            update(
                              "channels",
                              value === true
                                ? [...form.channels, option.value]
                                : form.channels.filter(
                                    (channel) => channel !== option.value,
                                  ),
                            )
                          }
                        />
                        <FieldLabel htmlFor={`sc-profile-${option.value}`}>
                          {option.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-spread sc:justify-between sc-wrap sc:flex-wrap">
            <span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]" role="status">
              {saving
                ? "正在保存演示偏好…"
                : dirty
                  ? "有未保存的修改"
                  : "当前没有未保存的修改"}
            </span>
            <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={reset}
              >
                还原演示数据
              </Button>
              <Button
                type="submit"
                form="sc-preferences-form"
                disabled={saving}
              >
                {saving ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Check data-icon="inline-start" />
                )}
                {saving ? "保存中…" : "保存偏好"}
              </Button>
            </div>
          </CardFooter>
        </Card>
        <aside className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>资料预览</CardTitle>
              <CardDescription>随着表单即时更新。</CardDescription>
            </CardHeader>
            <CardContent className="sc-stack sc:flex sc:flex-col sc:gap-[18px] sc:min-w-0">
              <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0">
                <Badge variant="secondary">
                  {form.name.trim().slice(0, 1) || "你"}
                </Badge>
                <div>
                  <strong>{form.name.trim() || "等待填写名称"}</strong>
                  <p className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">
                    {form.email.trim() || "等待填写邮箱"}
                  </p>
                </div>
              </div>
              <Separator />
              <dl className="sc-summary sc:m-0 sc:flex sc:flex-col sc:gap-[15px] sc:[font-size:13px] sc:[&_>_div]:flex sc:[&_>_div]:justify-between sc:[&_>_div]:gap-4 sc:[&_dt]:text-muted-foreground sc:[&_dd]:m-0 sc:[&_dd]:text-right">
                <div>
                  <dt>业务方向</dt>
                  <dd>{directionLabels[form.direction]}</dd>
                </div>
                <div>
                  <dt>工作摘要</dt>
                  <dd>{form.weekly ? "已开启" : "已关闭"}</dd>
                </div>
                <div>
                  <dt>订阅内容</dt>
                  <dd>{form.channels.length} 项</dd>
                </div>
              </dl>
              <p className="sc-preview-bio sc:[font-size:14px] sc:leading-[1.75] sc:[overflow-wrap:anywhere]">
                {form.bio.trim() || "还没有填写个人简介。"}
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline">演示账户</Badge>
            </CardFooter>
          </Card>
          <Alert>
            <Settings2 />
            <AlertTitle>一套独立的组件体系</AlertTitle>
            <AlertDescription>
              此设置页由 shadcn/ui 的
              Card、Field、Input、Select、Switch、Checkbox、Textarea、Button 与
              Alert 组成，使用逐科品牌语义主题。
            </AlertDescription>
          </Alert>
        </aside>
      </div>
    </div>
  );
}

export default function ShadcnView({
  mode = "light",
  compact = false,
  stopped = false,
}) {
  const [tab, setTab] = useState(readTab);
  useEffect(() => {
    const onHashChange = () => setTab(readTab());
    addEventListener("hashchange", onHashChange);
    return () => removeEventListener("hashchange", onHashChange);
  }, []);
  const changeTab = (value) => {
    setTab(value);
    history.replaceState(null, "", `#shadcn?tab=${value}`);
  };
  return (
    <section className="ds-view" data-shadcn-view>
      <header className="ds-page-heading tw:max-w-[760px] tw:[&_h1]:m-[0_0_12px] tw:[&_>_p]:m-0 tw:mb-9 tw:[&_h1]:[font-size:var(--ant-token-font-size-heading1,_38px)] tw:[&_h1]:[font-weight:var(--ds-strong)] tw:[&_h1]:leading-[1.23] tw:[&_h1]:mb-4 tw:[&_h1]:[letter-spacing:-.025em] tw:[&_>_p]:text-[var(--ds-muted)] tw:[&_>_p]:max-w-[70ch] tw:[&_>_p]:[font-size:15px] tw:[&_>_p]:leading-[1.8] tw:[&_>_p]:mb-0 tw:at-most-767:[&_h1]:[font-size:30px] tw:at-most-767:[&_>_p]:text-sm">
        <h1>shadcn/ui</h1>
        <p>
          以真实 shadcn/ui 组件承载逐科品牌主题，与 Ant Design 共享品牌语义。
          按产品场景选用生态，保留各自的组件比例和交互。
        </p>
      </header>
      <ShadcnScope mode={mode} stopped={stopped}>
        <div className="sc-showcase sc:min-w-0 sc:pt-1 sc:[&_:where(h2)]:[font-size:22px] sc:[&_:where(h2)]:leading-[1.4] sc:[&_:where(h2)]:font-semibold sc:[&_:where(h2)]:m-[0_0_8px] sc:[&_:where(h3)]:[font-size:16px] sc:[&_:where(h3)]:leading-[1.5] sc:[&_:where(h3)]:font-semibold sc:[&_:where(h3)]:m-[0_0_12px] sc:[&_:where(p)]:m-0 sc:[&_[data-slot='field-description']]:m-0! sc:[&_.sc-section-intro_p]:text-muted-foreground sc:[&_.sc-section-intro_p]:leading-[1.75] sc:[&_.sc-section-intro_p]:max-w-[76ch] sc:at-most-767:[&_h2]:[font-size:20px]">
          <div className="sc-inline sc:flex sc:items-center sc:gap-[10px] sc:min-w-0 sc-wrap sc:flex-wrap sc-mode-note sc:mb-5">
            <Badge variant="outline">New York / COHESION</Badge>
            <Badge variant="secondary">
              {mode === "dark" ? "深色主题" : "浅色主题"}
            </Badge>
            {compact && (
              <span className="sc-muted sc:text-muted-foreground sc:[font-size:13px] sc:leading-[1.65]">
                当前保留 shadcn/ui 默认尺寸；不使用 Ant Design 的
                compactAlgorithm。
              </span>
            )}
          </div>
          <Tabs value={tab} onValueChange={changeTab} className="sc-main-tabs sc:min-w-0">
            <TabsList className="sc-tabs-list sc:max-w-full sc:at-most-767:grid sc:at-most-767:[grid-template-columns:repeat(2,_minmax(0,_1fr))] sc:at-most-767:w-full sc:at-most-767:h-auto! sc:at-most-767:[grid-auto-rows:33px] sc:at-most-767:[&_>_*]:px-[7px] sc:at-most-360:[&_>_*]:px-[5px] sc:at-most-360:[&_>_*]:[font-size:12px]" aria-label="shadcn/ui 展示内容">
              <TabsTrigger value="tokens">预设与 token</TabsTrigger>
              <TabsTrigger value="components">组件与状态</TabsTrigger>
              <TabsTrigger value="patterns">产品组合</TabsTrigger>
              <TabsTrigger value="transitions">Transitions 动效</TabsTrigger>
            </TabsList>
            <TabsContent value="tokens">
              <TokenView />
            </TabsContent>
            <TabsContent value="components">
              <ComponentView />
            </TabsContent>
            <TabsContent value="patterns">
              <PatternView />
            </TabsContent>
            <TabsContent value="transitions">
              <TransitionsGallery stopped={stopped} />
            </TabsContent>
          </Tabs>
        </div>
      </ShadcnScope>
    </section>
  );
}
