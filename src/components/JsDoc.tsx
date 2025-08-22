import { A, UL, LI } from 'storybook/internal/components';
import { Link } from '@designsystem/extract';

interface LinksProps {
  links: Link[];
}

export function Links({ links }: LinksProps) {
  return (
    <UL className="sbdocs sbdocs-ul" style={{ listStyle: 'none', paddingLeft: 0 }}>
      {links.map((link) => (
        <LI className="sbdocs sbdocs-li" key={link.href}>
          <A className="sbdocs sbdocs-a" key={link.href} href={link.href}>
            {link.text || link.href}
          </A>
        </LI>
      ))}
    </UL>
  );
}