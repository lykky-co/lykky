"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  frameworks,
  playbooks,
  templates,
  resources,
  caseStudies,
} from "#site/content"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

const sortedFrameworks = [...frameworks].sort((a, b) => a.order - b.order)
const playbooksByRegion = {
  oulu: [...playbooks]
    .filter((p) => p.region === "oulu")
    .sort((a, b) => a.order - b.order),
  finland: [...playbooks]
    .filter((p) => p.region === "finland")
    .sort((a, b) => a.order - b.order),
  nordics: [...playbooks]
    .filter((p) => p.region === "nordics")
    .sort((a, b) => a.order - b.order),
}

const regionLabels: Record<string, string> = {
  oulu: "Oulu",
  finland: "Finland",
  nordics: "Nordics",
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string
  pathname: string
  children: React.ReactNode
}) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={pathname === href} size="sm">
        <Link href={href} title={typeof children === "string" ? children : undefined}>
          <span className="truncate">{children}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

function TopNavLink({
  href,
  pathname,
  children,
}: {
  href: string
  pathname: string
  children: React.ReactNode
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === href} size="sm">
        <Link href={href} title={typeof children === "string" ? children : undefined}>
          <span className="truncate">{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function CollapsibleSection({
  label,
  defaultOpen = false,
  children,
}: {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
            <ChevronRight className="size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            <span>{label}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function SiteSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Learn
        </span>
      </SidebarHeader>
      <SidebarContent>
        {/* Frameworks */}
        {sortedFrameworks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Frameworks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sortedFrameworks.map((fw) => (
                  <TopNavLink
                    key={fw.slug}
                    href={`/learn/frameworks/${fw.slug}`}
                    pathname={pathname}
                  >
                    {fw.title}
                  </TopNavLink>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Playbooks — collapsible by region */}
        {playbooks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Playbooks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.entries(playbooksByRegion).map(
                  ([region, pbs]) =>
                    pbs.length > 0 && (
                      <CollapsibleSection
                        key={region}
                        label={regionLabels[region] ?? region}
                        defaultOpen={region === "oulu"}
                      >
                        {pbs.map((pb) => (
                          <NavLink
                            key={pb.slug}
                            href={`/learn/playbooks/${pb.slug}`}
                            pathname={pathname}
                          >
                            {pb.title}
                          </NavLink>
                        ))}
                      </CollapsibleSection>
                    ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Templates */}
        {templates.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Templates</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {templates.map((tpl) => (
                  <TopNavLink
                    key={tpl.slug}
                    href={`/learn/templates/${tpl.slug}`}
                    pathname={pathname}
                  >
                    {tpl.title}
                  </TopNavLink>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Resources</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {resources.map((res) => (
                  <TopNavLink
                    key={res.slug}
                    href={`/learn/resources/${res.slug}`}
                    pathname={pathname}
                  >
                    {res.title}
                  </TopNavLink>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Case Studies</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {caseStudies.map((cs) => (
                  <TopNavLink
                    key={cs.slug}
                    href={`/learn/case-studies/${cs.slug}`}
                    pathname={pathname}
                  >
                    {cs.title}
                  </TopNavLink>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
