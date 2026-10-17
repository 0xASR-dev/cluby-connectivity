import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Club discovery',
    description:
      'Find and join clubs that match your interests. Connect with like-minded people.',
    accent: 'bg-[#e8dfc9] text-[#344b38]',
  },
  {
    icon: CalendarDays,
    title: 'Event management',
    description:
      'Stay updated with all campus events and never miss an opportunity to participate.',
    accent: 'bg-[#e8dfc9] text-[#344b38]',
  },
  {
    icon: MessageCircle,
    title: 'Community engagement',
    description:
      'Engage with your community through discussions, announcements, and more.',
    accent: 'bg-[#d9e5dc] text-[#344b38]',
  },
];

const LandingPage = () => {
  return (
  <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
    <header className="relative z-10">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          aria-label="Cluby home"
          className="group inline-flex items-center gap-2.5 rounded-sm text-xl font-semibold tracking-[-0.06em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344b38]"
        >
          cluby
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
          <a className="transition-colors hover:text-primary" href="#features">
            What you can do
          </a>
          <a className="transition-colors hover:text-primary" href="#about">
            The idea
          </a>
          <a className="transition-colors hover:text-primary" href="#contact">
            Get involved
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground motion-safe:transition-[transform,background-color] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Join Cluby
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>

    <main className="w-full max-w-full">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-12 lg:pb-36 lg:pt-20">
        <div className="relative z-[1]">
          <h1 className="max-w-6xl text-[clamp(2.25rem,6vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.065em]">
            <span className="block">Campus clubs,</span>
            <span className="mt-2 block italic text-primary">
              events &amp; community.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Discover clubs, join events, and build meaningful connections—all
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground motion-safe:transition-[transform,background-color] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Get started
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
              />
            </Link>
            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Take a look
              <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="group relative mx-auto aspect-[0.68] w-full max-w-[34rem] overflow-hidden rounded-[2rem] bg-secondary p-5 motion-safe:transition-colors motion-safe:duration-300 hover:bg-secondary/80 sm:aspect-[0.96] sm:p-8">
          <div className="flex h-full items-center">
            <div className="w-full rounded-[1.35rem] border border-border bg-card p-5 shadow-[0_18px_48px_rgba(42,57,43,0.1)] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.015] sm:p-7">
              <p className="text-2xl font-medium leading-tight tracking-[-0.05em] text-card-foreground sm:text-4xl">
                  Browse clubs,
                  <br />
                  events, and discussions.
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Explore club listings, campus events, and community
                  discussions.
              </p>

              <ul className="mt-6 divide-y divide-border border-t border-border">
                <li className="flex items-center gap-3 py-3 text-sm font-medium text-primary">
                  <Users aria-hidden="true" className="h-4 w-4" />
                  Club discovery
                </li>
                <li className="flex items-center gap-3 py-3 text-sm font-medium text-primary">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  Event updates
                </li>
                <li className="flex items-center gap-3 py-3 text-sm font-medium text-primary">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  Community discussions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-8 border-y border-border bg-card py-20 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
            <div>
              <h2 className="max-w-xl text-4xl leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Discover clubs. Follow events. Join discussions.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground md:justify-self-end md:text-lg md:leading-8">
              Club discovery, campus event updates, and community discussions
              in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="flex min-h-[19rem] flex-col rounded-[1.5rem] border border-border bg-background p-6 transition-colors duration-200 hover:border-primary/40 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${feature.accent}`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-auto pt-12">
                    <h3
                      className="text-2xl font-medium tracking-[-0.04em]"
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-8 mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24 lg:px-12 lg:py-36"
      >
        <div>
          <h2
            className="max-w-xl text-4xl leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
          >
            Clubs, events, and campus conversations.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Find clubs that match your interests, stay updated with campus
            events, and join community discussions.
          </p>
          <Link
            to="/register"
            className="group mt-8 inline-flex items-center gap-2 border-b border-primary pb-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Create an account
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] bg-primary p-6 text-primary-foreground sm:p-9 lg:p-11">
          <div className="relative">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div className="flex items-center gap-3">
                <Users aria-hidden="true" className="h-5 w-5 text-secondary" />
                <div>
                  <h3 className="font-medium tracking-[-0.02em]">
                    What you can do on Cluby
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/75">
                    Clubs, campus events, and community discussions.
                  </p>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-primary-foreground/15">
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="flex items-center gap-4">
                  <span className="text-lg tracking-[-0.03em] sm:text-xl">
                    Browse and join clubs
                  </span>
                </span>
                <Users aria-hidden="true" className="h-5 w-5 text-primary-foreground/70" />
              </li>
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="flex items-center gap-4">
                  <span className="text-lg tracking-[-0.03em] sm:text-xl">
                    View campus events
                  </span>
                </span>
                <CalendarDays
                  aria-hidden="true"
                  className="h-5 w-5 text-primary-foreground/70"
                />
              </li>
              <li className="flex items-center justify-between gap-4 py-5">
                <span className="flex items-center gap-4">
                  <span className="text-lg tracking-[-0.03em] sm:text-xl">
                    Join community discussions
                  </span>
                </span>
                <MessageCircle
                  aria-hidden="true"
                  className="h-5 w-5 text-primary-foreground/70"
                />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-8 bg-secondary px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-9 md:flex-row md:items-end">
          <div>
            <h2
              className="max-w-3xl text-4xl leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-7xl"
            >
              Discover clubs and campus events.
            </h2>
          </div>
          <Link
            to="/register"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground motion-safe:transition-[transform,background-color] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Join Cluby
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>

    <footer className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <Link
          to="/"
          className="inline-flex w-fit items-center text-lg font-semibold tracking-[-0.06em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344b38]"
        >
          cluby
        </Link>
        <p className="text-sm text-muted-foreground">
          Discover clubs, campus events, and community discussions.
        </p>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link
            to="/login"
            className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Get started
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <div className="border-t border-border px-5 py-4 sm:px-8 lg:px-12">
        <p className="mx-auto max-w-7xl text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cluby. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
  );
};

export default LandingPage;
