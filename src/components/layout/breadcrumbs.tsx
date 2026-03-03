"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"

/** Title-case a kebab-case slug, handling common exceptions. */
function formatSegment(segment: string): string {
  const specialCases: Record<string, string> = {
    "case-studies": "Case Studies",
    gtm: "GTM",
    icp: "ICP",
  }

  if (specialCases[segment]) return specialCases[segment]

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function Breadcrumbs() {
  const pathname = usePathname()
  if (!pathname || pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  // Build cumulative paths for each segment
  const crumbs = segments.map((seg, i) => ({
    label: formatSegment(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
